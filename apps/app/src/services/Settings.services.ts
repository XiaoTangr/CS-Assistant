// Settings.services.ts
import SettingsRepository from "@/repositories/Settings.Repository";
import { Settings } from "@/models/Settings.model";

export default class SettingsService {
    /**
     * 获取所有设置数据
     * @returns 返回设置对象数组
     */
    static async getAllSettings(): Promise<Settings[]> {
        return await SettingsRepository.queryAll();
    }
    /**
     * 根据 key 获取单个设置
     * @param key - 设置项的键名
     * @returns 返回匹配的 Settings 对象或 null
     */
    static async getSettingByKey(key: string): Promise<Settings | null> {
        return await SettingsRepository.queryOneByKey(key);
    }

    /**
     * 更新单条设置记录
     * @param setting - 要更新的 Setting 对象
     * @returns 受影响行数
     */
    static async updateSetting(setting: Settings): Promise<number> {
        return await SettingsRepository.updateRow(setting);
    }

    /**
     * 批量更新设置记录
     * @param settings - Settings 对象数组
     * @returns 受影响行数
     */
    static async updateAllSettings(settings: Settings[]): Promise<number> {
        return await SettingsRepository.updateRows(settings);
    }

    /**
     * 插入新的设置记录
     * @param settings - Settings 对象数组
     * @returns 受影响行数
     */
    static async addSettingsItem(settings: Settings): Promise<number> {
        return await SettingsRepository.insertRows([settings]);
    }

    /**
     * 删除指定 key 的设置记录
     * @param key - 要删除的 key 值
     * @returns 受影响行数
     */
    static async deleteSetting(key: string): Promise<number> {
        return await SettingsRepository.deleteRow(key);
    }

    /**
     * 使用默认设置（待实现）
     */
    static async useDefaultSettings(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}