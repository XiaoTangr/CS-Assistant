/**
 * KeyValueService.ts
 * 用于实现键值对的CRUD操作功能
 * 使用单例模式以及模块导出
 */

import { dbConnecter } from "../db/dbConnector";

// 数据库表名
const TABLE_NAME = 'AppKeyValues';

// 数据表结构定义
interface TABLE_STRUCTURE {
    key: string;
    value: string;
}



class KeyValueService {
    private static instance: KeyValueService;
    private constructor() { }
    public static getInstance(): KeyValueService {
        if (!KeyValueService.instance) {
            KeyValueService.instance = new KeyValueService();
        }
        return KeyValueService.instance;
    }

    /**
     * 数据表初始化
     */
    initTable = async () => {
        // 先检查是否存在表
    }

    /**
     * 按照key获取对应的值，如果不存在则保存并且返回默认值
     * @param key 键
     * @param defaultValue 可选 key对应的默认值
     */
    getValue = async (key: string, defaultValue?: string) => {
        try {
            const db = await dbConnecter.getInstance().getConnection();
        }
        catch (error) { }
        finally { }
    }

    /**
     * 设置对应的键值对
     * @param key 键
     * @param value 值
     */
    setValue = (key: string, value: string) => {

    }

}
export const keyValueService = KeyValueService.getInstance();