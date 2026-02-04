/**
 * 设置服务模块
 * 提供设置项的管理、存储和验证功能
 * @packageDocumentation
 */

import { Setting, SettingGroup } from '../types/Settings';
import { APP_SETTINGS, SETTING_GROUPS, getSettingsByGroup, getSettingById } from '../data/settingsConfig';

/**
 * 设置服务类
 * 单例模式，负责管理应用程序的所有设置项
 */
export class SettingService {
    /** 单例实例 */
    private static instance: SettingService;
    /** 当前设置项列表 */
    private settings: Setting[] = [];
    /** 设置分组列表 */
    private groups: SettingGroup[] = [];

    /**
     * 私有构造函数
     * 初始化设置服务
     */
    private constructor() {
        this.initialize();
    }

    /**
     * 获取设置服务单例实例
     * @returns 设置服务实例
     */
    public static getInstance(): SettingService {
        if (!SettingService.instance) {
            SettingService.instance = new SettingService();
        }
        return SettingService.instance;
    }

    /**
     * 初始化设置服务
     * 加载默认配置和用户自定义设置
     */
    private initialize(): void {
        // 从配置初始化设置
        this.settings = [...APP_SETTINGS];
        this.groups = [...SETTING_GROUPS];
        
        // 从存储中加载用户自定义设置
        this.loadFromStorage();
    }

    /**
     * 获取所有设置分组
     * @returns 设置分组数组
     */
    public getGroups(): SettingGroup[] {
        return this.groups;
    }

    /**
     * 根据分组ID获取设置项
     * @param groupId 分组ID
     * @returns 该分组下的所有设置项
     */
    public getSettingsByGroup(groupId: string): Setting[] {
        return getSettingsByGroup(groupId);
    }

    /**
     * 获取所有设置项
     * @returns 所有设置项数组
     */
    public getAllSettings(): Setting[] {
        return this.settings;
    }

    /**
     * 根据ID获取特定设置项
     * @param id 设置项ID
     * @returns 设置项对象，如果未找到则返回undefined
     */
    public getSetting(id: string): Setting | undefined {
        return getSettingById(id);
    }

    /**
     * 更新设置项的值
     * @param id 设置项ID
     * @param value 新的设置值
     * @returns 更新成功返回true，失败返回false
     */
    public updateSetting(id: string, value: any): boolean {
        const setting = this.getSetting(id);
        if (!setting) return false;

        try {
            // 类型验证
            if (!this.validateValueType(setting, value)) {
                throw new Error(`Invalid value type for setting ${id}`);
            }

            setting.value = value;
            this.saveToStorage();
            return true;
        } catch (error) {
            console.error('Failed to update setting:', error);
            return false;
        }
    }

    /**
     * 将设置项重置为默认值
     * @param id 设置项ID
     * @returns 重置成功返回true，失败返回false
     */
    public resetSetting(id: string): boolean {
        const setting = this.getSetting(id);
        if (!setting) return false;

        setting.value = setting.defaultValue;
        this.saveToStorage();
        return true;
    }

    /**
     * 批量更新多个设置项
     * @param updates 包含设置ID和新值的对象
     * @returns 批量更新成功返回true，失败返回false
     */
    public batchUpdate(updates: Record<string, any>): boolean {
        try {
            Object.entries(updates).forEach(([id, value]) => {
                this.updateSetting(id, value);
            });
            return true;
        } catch (error) {
            console.error('Batch update failed:', error);
            return false;
        }
    }

    /**
     * 导出当前所有设置
     * @returns JSON格式的设置数据字符串
     */
    public exportSettings(): string {
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            settings: this.settings.map(setting => ({
                id: setting.key,
                value: setting.value
            }))
        };
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * 导入设置数据
     * @param data JSON格式的设置数据字符串
     * @returns 导入成功返回true，失败返回false
     */
    public importSettings(data: string): boolean {
        try {
            const importData = JSON.parse(data);
            if (!importData.settings || !Array.isArray(importData.settings)) {
                throw new Error('Invalid import data format');
            }

            importData.settings.forEach((item: any) => {
                if (item.id && item.value !== undefined) {
                    this.updateSetting(item.id, item.value);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Import settings failed:', error);
            return false;
        }
    }

    /**
     * 验证设置值的类型是否正确
     * @private
     * @param setting 设置项对象
     * @param value 要验证的值
     * @returns 类型匹配返回true，否则返回false
     */
    private validateValueType(setting: Setting, value: any): boolean {
        switch (setting.type) {
            case 'text':
            case 'select':
            case 'path':
                return typeof value === 'string';
            case 'switch':
                return typeof value === 'boolean';
            default:
                return false;
        }
    }

    /**
     * 将设置保存到本地存储
     * @private
     */
    private saveToStorage(): void {
        try {
            const storageData = this.settings.map(setting => ({
                id: setting.key,
                value: setting.value
            }));
            localStorage.setItem('app-settings', JSON.stringify(storageData));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    /**
     * 从本地存储加载设置
     * @private
     */
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem('app-settings');
            if (stored) {
                const storedSettings = JSON.parse(stored);
                storedSettings.forEach((item: any) => {
                    const setting = this.getSetting(item.id);
                    if (setting && this.validateValueType(setting, item.value)) {
                        setting.value = item.value;
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }
}

/** 设置服务的单例实例 */
export const settingService = SettingService.getInstance();