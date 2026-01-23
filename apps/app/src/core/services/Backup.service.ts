import { AppConfigService, LogService } from ".";
import { Backup } from "../models";
import { BackupRepository } from "../repositories";
import { cp, getCurrentTimestamp } from "../utils";

export default class BackupService {

    private backupRepo: BackupRepository;
    private static instance: BackupService;

    private constructor() {
        this.backupRepo = BackupRepository.getInstance();
    }

    static getInstance(): BackupService {
        if (!BackupService.instance) {
            BackupService.instance = new BackupService();
        }
        return BackupService.instance;
    }


    async bulkCreate(payloads: Backup[]): Promise<number> {
        return await this.backupRepo.bulkCreate(payloads);
    }


    /**
     * 创建备份
     * @param payload - 备份信息
     * @returns Promise<number> - 返回操作结果，0 表示成功，-1 表示失败
     */
    async createBackup(payload: Backup): Promise<number> {
        // 获取备份保存路径
        let bpBasePath = await (AppConfigService.getInstance().getValue("backupPath")) as string | null
        // 获取 Steam 安装路径
        let steamInstallPath = await (AppConfigService.getInstance().getValue("steamInstallPath")) as string | null;

        if (!bpBasePath) {
            LogService.error("[BackupService.createBackup] 未找到备份保存路径");
            return -1;
        }
        if (!steamInstallPath) {
            LogService.error("[BackupService.createBackup] 未找到 Steam 安装路径");
            return -1;
        }

        try {
            //TODO 先进行备份，然后存储记录到数据库
            // 备份路径：`${path}\\${fid}\\${timePath}\\730`;
            let fromPath = `${steamInstallPath}\\userdata\\${payload.friendId}\\730`;
            let toPah = `${bpBasePath}\\${payload.folderPath}`;

            // 复制文件
            await cp(fromPath, toPah).then(async () => {
                LogService.info(`[BackupService.createBackup] 复制完成: ${fromPath} 到 ${toPah}`);
                // 存储记录到数据库
                await this.backupRepo.bulkCreate([payload]).then(() => {
                    LogService.info(`[BackupService.createBackup] 备份记录已存储到数据库: ${JSON.stringify(payload)}`);
                    return 0;
                });
            }).catch((error) => {
                LogService.error(`[BackupService.createBackup] 复制失败: ${fromPath} 到 ${toPah}:`, error);
            });
        } catch (error) {
            LogService.error("[BackupService.createBackup] 备份失败:", error);
        }
        return -1
    }

    /**
     * 获取备份和恢复数据
     * @returns Promise<Backup[]>|null 匹配的备份和恢复数据
     */
    async getBackupFolderPath(): Promise<string | null> {
        return (await AppConfigService.getInstance().getValue("backupPath")) as string | null;
    }
    /**
     * 获取数据总数
     */
    async getDataCount(): Promise<number | null> {
        return await this.backupRepo.count() ?? null;
    }

    /**
     * 分页查询
     * @param currentPage 当前页码
     * @param pageSize 分页大小
     * @returns Promise<Backup[]>|null 查询结果
     */
    async getPageData(currentPage: number, pageSize: number): Promise<Backup[] | null> {
        return await this.backupRepo.findPaginated(currentPage, pageSize) ?? null;
    }
}
