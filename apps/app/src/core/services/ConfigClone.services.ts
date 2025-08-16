import { useBackupAndRecoveryStore } from "@/store/BackupAndRecoveryStore";
import { BackupAndRecovery } from "../models";
import { cp, getCurrentTimestamp, isFileExists, rm, timestampToFolderName } from "../utils";
import LogServices from "./Log.services";
import SettingsService from "./Settings.services";
import { useLoginedSteamUserStore } from "@/store/LoginedSteamUserStore";
import BackupAndRecoveryService from "./BackupAndRecovery.services";

export default class ConfigCloneService {

    /**
     *  获取 userData\<FriendId>\730 路径
     * @param FriendId - Steam 账号 ID
     * @returns 返回对应账号的完整 730 路径
     */
    static async get730Path(FriendId: number) {
        let db = await SettingsService.getSettingByKey("steamInstallPath");
        let res = db?.selected as string | null;
        if (!res) {
            LogServices.error("[ConfigCloneService.getSteamInstallPath] 未找到 Steam 安装路径");
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
    static async cloneConfig(fromId: number, toId: number[], config?: { backUp?: boolean }): Promise<number[]> {
        let successList: number[] = [];
        try {
            let fromPath = await this.get730Path(fromId);
            for (const item of toId) {
                try {
                    let toPath = await this.get730Path(item);

                    // 如果需要备份，先备份目标路径
                    if (config?.backUp) {
                        try {
                            let createdAt = getCurrentTimestamp();
                            let p = await BackupAndRecoveryService.getBackupFolderPath();
                            let folderPath = `${p}\\${item}\\${timestampToFolderName(createdAt)}\\730`;

                            let loginedSteamUserStore = useLoginedSteamUserStore();
                            let nickName = (await loginedSteamUserStore.getLogedSteamUser({ friendId: item }))?.PersonaName || "未知用户";

                            let bpPayload: BackupAndRecovery = {
                                id: createdAt,
                                createdAt: createdAt,
                                friendId: item,
                                folderPath: folderPath,
                                nickName: nickName,
                                description: `在克隆前的备份: ${fromId} -> ${item}`,
                            };
                            await BackupAndRecoveryService.createBackup(bpPayload);
                            const BackupAndRecoveryStore = useBackupAndRecoveryStore();
                            BackupAndRecoveryStore.fetchData();



                            // let loginedSteamUserStore = useLoginedSteamUserStore();
                            // let nickName = (await loginedSteamUserStore.getLogedSteamUser({ friendId: item }))?.PersonaName || "未知用户";

                            // const BARStore = useBackupAndRecoveryStore();
                            // const { confirmCreateBackupData } = storeToRefs(BARStore);
                            // BARStore.setConfirmCreateBackupData();
                            // confirmCreateBackupData.value.nickName = nickName;
                            // confirmCreateBackupData.value.description = `在克隆前的备份: ${fromId} -> ${item}`;
                            // LogServices.debug(confirmCreateBackupData)
                            // await BARStore.createBackup();
                            // BARStore.setConfirmCreateBackupData({ reset: true });
                            // BARStore.fetchData();
                        } catch (backupError) {
                            LogServices.warn(`[ConfigCloneService.cloneConfig] 为账号 ${item} 创建备份失败:`, backupError);
                            // 即使备份失败，也继续执行复制操作
                        }
                    }

                    // 判断目标路径是否存在
                    if (await isFileExists(toPath)) {
                        // 删除目标路径
                        await rm(toPath, true);
                    }
                    await cp(fromPath, toPath);
                    LogServices.debug(`[ConfigCloneService.cloneConfig] 复制 ${fromPath} 到 ${toPath}`);
                    successList.push(item);
                } catch (itemError) {
                    LogServices.error(`[ConfigCloneService.cloneConfig] 复制到 ${item} 失败:`, itemError);
                    // 不抛出异常，继续处理下一个项目
                }
            }
        } catch (error) {
            LogServices.error(`[ConfigCloneService.cloneConfig] 初始化源路径失败:`, error);
        }
        return successList;
    }
}
