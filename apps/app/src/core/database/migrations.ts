// src/core/database/migrations.ts

import { baseCRUD } from '@/core/database';
import { defaultDatabaseData } from '@/core/database/defaultData';
import { updateData } from '@/core/database/updateData';
import { MigrationResult } from '@/core/models';
import { LogServices, MapService } from '../services';
import { getVersion } from '@tauri-apps/api/app';
import { versionComparator } from '../utils';
/**
 * 初始化数据库表结构和默认数据
 * @returns 返回迁移结果对象
 */
export const runMigrations = async (): Promise<MigrationResult> => {
    const result: MigrationResult = {
        success: true,
        createdTables: [],
        insertedDataResults: []
    };

    try {
        for (const table of defaultDatabaseData) {
            const tableName = table.tableName;
            const columns = table.Structure;


            // 构建 CREATE TABLE SQL
            const columnDefs = columns.map((col, index) => {
                let def = ` "${col.name}" ${mapType(col.type)}`;
                if (index === 0) {
                    def += ' PRIMARY KEY'; // 第一个字段为主键
                }
                if (!col.nullable) {
                    def += ' NOT NULL';
                }
                return def;
            });

            const createTableSql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs.join(', ')});`;

            await baseCRUD.executeRaw(createTableSql);

            result.createdTables.push(tableName);

            // 插入默认数据（如果存在）
            if (table.defaultData && table.defaultData.length > 0) {
                const insertSuccess = await insertDefaultData(tableName, table.defaultData);
                result.insertedDataResults.push({
                    table: tableName,
                    success: insertSuccess
                });
            }

            // 更新数据
            // 获取当前app版本 (确保 getVersion 函数存在且返回正确)
            let currentappVersion = await getVersion();
            // 获取数据库适配版本(该版本要求app至少为此版本才能正常工作)
            let needAppVersion = updateData.needAppVersion;
            // 数据库要求app至少为此版本才能正常工作
            let setDBVersion = updateData.setDBVersion;
            // 获取当前数据库版本 (确保 getValueByKey 函数能够正确返回)
            let currentDBVersion = await MapService.getValueByKey("DB_Version");

            // 检查是否需要更新数据库
            if (versionComparator(setDBVersion, currentDBVersion) > -1) {
                // 如果当前 App 版本 >= 所需版本，则允许更新
                if (versionComparator(currentappVersion, needAppVersion) >= 0) {
                    // 需要更新数据库
                    LogServices.debug("Database update required.");
                    // 执行更新逻辑...
                } else {
                    LogServices.debug("Current app version is too low for database update.");
                }
            } else {
                LogServices.debug("Database is already up to date.");
            }


        }

        LogServices.log('[DB runMigrations] Database initialized successfully.');
        return result;
    } catch (error) {
        LogServices.error('[DB runMigrations] Failed to initialize database:', error);
        result.success = false;
        result.error = error as Error;
        return result;
    }
}

/**
 * 将 JS 类型映射为 SQLite 类型
 */
const mapType = (jsType: string): string => {
    switch (jsType) {
        case 'string':
        case 'text':
            return 'TEXT';
        case 'integer':
        case 'number':
            return 'INTEGER';
        case 'boolean':
            return 'INTEGER'; // 用 0/1 表示布尔值
        case 'json':
            return 'TEXT'; // JSON 存储为字符串
        default:
            return 'TEXT';
    }
}

/**
 * 插入默认数据（如果表为空）
 * @param tableName 表名
 * @param defaultData 默认数据数组
 * @returns 成功返回 true，失败返回 false
 */
const insertDefaultData = async (tableName: string, defaultData: any[]): Promise<boolean> => {
    try {
        const count = await baseCRUD.count(tableName);

        if (count === 0) {
            LogServices.log(`[DB insertDefaultData] Inserting default data into ${tableName}`);

            // 确保传入的是真实的数据数组
            const dataToInsert = defaultData;

            // 增加校验：确保数组非空且第一个元素是对象
            if (!Array.isArray(dataToInsert) || dataToInsert.length === 0 || typeof dataToInsert[0] !== 'object') {
                LogServices.error(`[DB insertDefaultData] Invalid default data for table ${tableName}:`, dataToInsert);
                return false;
            }

            const rowsAffected = (await baseCRUD.insertRows(tableName, dataToInsert)).rowsAffected;
            LogServices.log(`[DB insertDefaultData] Inserted ${rowsAffected} rows into ${tableName}`);
            return rowsAffected > 0;
        }

        return true; // 表中已有数据，无需插入
    } catch (error) {
        LogServices.error(`[DB insertDefaultData] Failed to insert default data into ${tableName}:`, error);
        return false;
    }
}
