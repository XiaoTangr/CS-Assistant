// src/core/database/migrations.ts

import { baseCRUD } from '@/core/database';
import { defaultDatabaseData } from '@/core/database/defaultData';
import { MigrationResult } from '@/core/models';
import { LogServices } from '../services';

/**
 * 初始化数据库表结构和默认数据
 * @returns 返回迁移结果对象
 */
export async function runMigrations(): Promise<MigrationResult> {
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

            LogServices.log(`[DB] Creating table: ${tableName}`);
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
        }

        LogServices.log('[DB] Database initialized successfully.');
        return result;
    } catch (error) {
        LogServices.error('[DB] Failed to initialize database:', error);
        result.success = false;
        result.error = error as Error;
        return result;
    }
}

/**
 * 将 JS 类型映射为 SQLite 类型
 */
function mapType(jsType: string): string {
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
async function insertDefaultData(tableName: string, defaultData: any[]): Promise<boolean> {
    try {
        const count = await baseCRUD.count(tableName);

        if (count === 0) {
            LogServices.log(`[DB] Inserting default data into ${tableName}`);

            // 确保传入的是真实的数据数组
            const dataToInsert = defaultData;

            // 增加校验：确保数组非空且第一个元素是对象
            if (!Array.isArray(dataToInsert) || dataToInsert.length === 0 || typeof dataToInsert[0] !== 'object') {
                LogServices.error(`[DB] Invalid default data for table ${tableName}:`, dataToInsert);
                return false;
            }

            const rowsAffected = await baseCRUD.insertRows(tableName, dataToInsert);
            LogServices.log(`[DB] Inserted ${rowsAffected} rows into ${tableName}`);
            return rowsAffected > 0;
        }

        return true; // 表中已有数据，无需插入
    } catch (error) {
        LogServices.error(`[DB] Failed to insert default data into ${tableName}:`, error);
        return false;
    }
}