import { cp, getCurrentTimestamp, isFileExists, rm, timestampToFolderName } from "../utils";
import LogService from "./Log.service";
import AppConfigService from "./AppConfig.service";
import { Backup, KeyValue } from "../models";
import BackupService from "./Backup.service";
import { useLoginedSteamUserStore } from "../../store";
export default class ConfigCloneService {
    private static instance: ConfigCloneService;

    private backupService = BackupService.getInstance();
    private appConfigService = AppConfigService.getInstance();
    private constructor() {
        // 私有构造函数，防止外部实例化
    }
    static getInstance(): ConfigCloneService {
        if (!ConfigCloneService.instance) {
            ConfigCloneService.instance = new ConfigCloneService();
        }
        return ConfigCloneService.instance;
    }



    /**
     *  获取 userData\<FriendId>\730 路径
     * @param FriendId - Steam 账号 ID
     * @returns 返回对应账号的完整 730 路径
     */
    async get730Path(FriendId: number) {
        let db: KeyValue = await this.appConfigService.getSettingByKey("steamInstallPath");
        LogService.debug("[ConfigCloneService.getSteamInstallPath] Steam 安装路径:", db);
        let res = db?.value as string | null;
        if (!res) {
            LogService.error("[ConfigCloneService.getSteamInstallPath] 未找到 Steam 安装路径");
            throw new Error("未找到 Steam 安装路径");
        }
        return `${res}/userdata/${FriendId}/730/`;
    }


    /**
     * 复制文件
     * @param fromId - 复制的源 Steam 账号 ID
     * @param toId - 复制的目标 Steam 账号 ID 数组
     * @param backUp - 是否在复制前进行备份，默认为 true
     * @returns Promise<number[]> - 返回成功复制的目标账号 ID 数组
     */
    async cloneConfig(fromId: number, toId: number[], config?: { backUp?: boolean }): Promise<number[]> {
        let successList: number[] = [];
        try {
            let fromPath = await this.get730Path(fromId);
            for (const item of toId) {
                try {
                    let toPath = await this.get730Path(item);
                    let timeStamp = getCurrentTimestamp();
                    // 如果需要备份，先备份目标路径
                    if (config?.backUp) {
                        // TODO: 进行备份
                        let payload: Backup = {
                            friendId: item,
                            id: timeStamp,
                            description: `自动备份`,
                            folderPath: `${item}\\${timeStamp}\\730`,
                            nickName: useLoginedSteamUserStore().getUserByFriendId(item)?.nickName ?? "未知"
                        }
                        await this.backupService.createBackup(payload);
                    }

                    // 判断目标路径是否存在
                    if (await isFileExists(toPath)) {
                        // 删除目标路径
                        await rm(toPath, true);
                    }
                    // 复制源路径到目标路径
                    await cp(fromPath, toPath).then(() => {
                        LogService.info(`[ConfigCloneService.cloneConfig] 复制完成: ${fromPath} 到 ${toPath}`);
                        successList.push(item);
                    }).catch((error) => {
                        LogService.error(`[ConfigCloneService.cloneConfig] 复制失败: ${fromPath} 到 ${toPath}:`, error);
                    });
                } catch (itemError) {
                    LogService.error(`[ConfigCloneService.cloneConfig] 复制到 ${item} 失败:`, itemError);
                    // 不抛出异常，继续处理下一个项目
                }
            }
        } catch (error) {
            LogService.error(`[ConfigCloneService.cloneConfig] 初始化源路径失败:`, error);
        }
        return successList;
    }
}
