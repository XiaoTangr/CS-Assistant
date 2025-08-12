import { BackupAndRecoveryRepository } from "@/core/repositories";
import { BackupAndRecovery } from "../models";

export default class BackupAndRecoveryService {


    /**
     * 获取所有备份和恢复数据
     * @returns 返回备份和恢复对象数组
     */
    static async getAllBackupAndRecovery(): Promise<BackupAndRecovery[]> {
        return await BackupAndRecoveryRepository.findAll();
    }

    static async getPageData(currentPage: number, pageSize: number): Promise<BackupAndRecovery[]> {
        return (await BackupAndRecoveryRepository.findPaginated(currentPage, pageSize))
            .filter((item): item is BackupAndRecovery => item !== null);
    }

    /**
     * 获取指定备份和恢复数据
     * @param id 指定备份和恢复数据ID
     * @returns 指定备份和恢复对象
     */
    static async getBackupAndRecoveryById(id: number): Promise<BackupAndRecovery | null> {
        return await BackupAndRecoveryRepository.findOne({ c_id: id });
    }

    /**
     * 获取备份和恢复数据总数
     * @returns 备份和恢复数据总数
     */
    static getDataCount(): number | PromiseLike<number> {
        return BackupAndRecoveryRepository.count();
    }
}
