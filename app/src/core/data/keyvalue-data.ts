import { isEmpty } from "element-plus/es/utils/types.mjs";
import logService from "../service/log-service";
import { TABLE_NAME } from "../config/database-config";
import { keyValue } from "../types/database";
import { settingsMeta } from "../config/settings-config";
import { dbExecutor } from "./db-connect";

/**
 * 此代码用于实现对软件设置的持久化
 */
class KeyValueData {
    private static instance: KeyValueData;

    // 使用的数据表名
    private readonly USE_TABLE_NAME = TABLE_NAME.KEYVALUE;

    private constructor() {
    }
    public static getInstance(): KeyValueData {
        if (!KeyValueData.instance) {
            KeyValueData.instance = new KeyValueData();
        }
        return KeyValueData.instance;
    }


    /**
     *  初始化数据表
     */
    public async initTable() {
        // SQLit查询表是否存在
        let isExistsSql = ` SELECT name FROM sqlite_master WHERE type='table' AND name='${this.USE_TABLE_NAME}';`;

        const res = await dbExecutor.query(isExistsSql);
        if (isEmpty(res)) {
            logService.info(`[DB] 数据表 ${this.USE_TABLE_NAME} 不存在，正在创建...`);

            // 根据keyValue接口定义创建表的SQL
            const createTableSql = `
                CREATE TABLE ${this.USE_TABLE_NAME} (
                    key TEXT PRIMARY KEY NOT NULL,
                    value TEXT NOT NULL
                );
            `;
            try {
                await dbExecutor.execute(createTableSql);
                logService.info(`[DB] 数据表 ${this.USE_TABLE_NAME} 创建成功。`);
                // 插入默认数据，只在安装数据表时执行。
                for (const item of settingsMeta) {
                    const hasKey = await this.getValue(item.key);
                    if (!hasKey) {
                        logService.info(`[DB] 数据库缺少 ${item.key}，正在插入...`);
                        await this.setValue(item.key, item.defaultValue);
                    }
                }
            } catch (error) {
                logService.error(`[DB] 创建数据表 ${this.USE_TABLE_NAME} 失败: ${error}`);
                throw error;
            }
        } else {
            logService.info(`[DB] 数据表 ${this.USE_TABLE_NAME} 已存在。`);
        }
    }

    /**
     *  获取键对应的值
     * @param key  键
     * @returns  对应值  null 表示没有找到
     */
    public async getValue(key: string) {

        if (isEmpty(key) || !key) {
            throw logService.error("[DB] 键不能为空");
        }
        try {
            const sql = `SELECT * FROM ${this.USE_TABLE_NAME} WHERE key = $1;`
            const params = [key];
            const res = await dbExecutor.query<keyValue>(sql, params);
            if (isEmpty(res)) {
                logService.error(`[DB] 未查询到对应的记录: ${key}`);
                return null;
            }
            return res[0].value;
        } catch (error) {
            logService.error(`[DB] 查询 ${key} 记录时出错: ${error}`);
            return null; // 确保在错误情况下也返回null而不是undefined
        }
    }

    /**
     *  保存键值对到数据库中
     * @param key   键
     * @param value  值
     * @returns  0 成功 -1 失败
     */
    public async setValue(key: string, value: any) {
        if (isEmpty(key) || !key) {
            throw logService.error("[DB] 键不能为空");
        }
        if (isEmpty(value)) {
            throw logService.error("[DB] 值不能为空");
        }
        try {
            let params = [key, value];
            let sql = `UPDATE ${this.USE_TABLE_NAME} SET value = $2 WHERE key = $1;`;
            let isUpdateSuccess = (await dbExecutor.execute(sql, params)).rowsAffected;
            if (isUpdateSuccess <= 0) {
                logService.info(`[DB] 未找到对应的记录，正在插入数据: ${key} = ${value}`);
                sql = `INSERT INTO ${this.USE_TABLE_NAME} (key, value) VALUES ($1, $2);`;
                isUpdateSuccess = (await dbExecutor.execute(sql, params)).rowsAffected;
                if (isUpdateSuccess <= 0) {
                    logService.error(`[DB] 插入数据失败: ${key} = ${value}`);
                    return -1; // 确保在错误情况下返回-1表示失败
                }
            }
            logService.info(`[DB] 更新数据成功: ${key} = ${value}`);
            return 0;
        }
        catch (error) {
            logService.error(`[DB] 更新 ${key} = ${value}失败: ${error}`);
            return -1; // 确保在错误情况下返回-1表示失败
        }
    }

}
const keyValueData = KeyValueData.getInstance();
export default keyValueData;