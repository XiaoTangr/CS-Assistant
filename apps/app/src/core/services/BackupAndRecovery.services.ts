import { BackupAndRecoveryRepository } from "@/core/repositories";
import { BackupAndRecovery } from "../models";
import SettingsService from "./Settings.services";

import { cp, isFileExists, rm } from "../utils";
import LogServices from "./Log.services";


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



    static async createBackup(payload: BackupAndRecovery): Promise<number> {
        // 还要进行文件系统的备份操作

        let dbSteamInstallPath = await SettingsService.getSettingByKey('steamInstallPath');

        let streamInstallPath = dbSteamInstallPath?.selected
        const fromPath = `${streamInstallPath}/userdata/${payload.friendId}/730`;
        const toPath = payload.folderPath;

        try {
            await cp(fromPath, toPath, true);
            await BackupAndRecoveryRepository.bulkCreate([payload])
            return 0;
        } catch (error: any) {
            LogServices.error(error);
            throw error.message;
        }
    }

    /**
     * @description 恢复备份数据
     * @param id 备份和恢复数据ID
     * @param keepBackup 是否保留备份数据，默认true
     * @returns 0:恢复成功
     * @throws 错误信息
     */
    static async restoreBackUp(id: number, keepBackup: boolean = true): Promise<number> {
        let payload = await BackupAndRecoveryRepository.findOne({ 'c_id': id });

        if (!payload) {
            throw '备份和恢复数据不存在';
        }
        let dbSteamInstallPath = await SettingsService.getSettingByKey('steamInstallPath');

        let streamInstallPath = dbSteamInstallPath?.selected
        let fromPath = payload.folderPath;
        let toPath = `${streamInstallPath}/userdata/${payload.friendId}/730`;

        LogServices.debug(payload);
        // 删除UserData下的730文件夹
        if (await isFileExists(toPath)) {
            await rm(toPath, true);
        }
        try {
            await cp(fromPath, toPath, true);
            if (!keepBackup) {
                // 删除备份数据
                await rm(fromPath, true);
                await BackupAndRecoveryRepository.deleteOne({ c_id: id });

            }
            return 0;
        } catch (error: any) {
            LogServices.error(error);
            throw error.message;
        }
    }

    /**
     * 删除备份和恢复数据
     * @param id 备份和恢复数据ID
     * @returns 0:删除成功
     * @throws 错误信息
     */
    static async deleteBackup(id: number): Promise<number> {
        let payload = await BackupAndRecoveryRepository.findOne({ 'c_id': id });
        if (!payload) {
            throw '备份和恢复数据不存在';
        }
        let delPath = payload.folderPath.replace(`\\730`, "");

        LogServices.debug(`删除备份数据: ${delPath}`);

        // 删除文件系统的备份数据
        if (await isFileExists(delPath)) {
            await rm(delPath, true);
        }
        let res = await BackupAndRecoveryRepository.deleteOne({ c_id: id });
        if (res > 0) {
            return 0;
        }
        return -1;
    }
}
