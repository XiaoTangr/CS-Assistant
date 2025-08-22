// src/core/database/migrations.ts

import { baseCRUD } from '@/core/database';
import { defaultDatabaseData, updateDatabaseData } from '@/core/database/dbData';
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
            let needAppVersion = updateDatabaseData.needAppVersion;
            // 数据库要求app至少为此版本才能正常工作
            let setDBVersion = updateDatabaseData.setDBVersion;
            let currentDBVersion = await MapService.getValueByKey("DB_Version");

            // 检查是否需要更新数据库
            if (versionComparator(setDBVersion, currentDBVersion) > 0) {
                // 如果当前 App 版本 >= 所需版本，则允许更新
                if (versionComparator(currentappVersion, needAppVersion) >= 0) {
                    // 需要更新数据库
                    LogServices.log("[DB runMigrations] Database update required.");
                    let dataArr = updateDatabaseData.payloads.length > 0 ? updateDatabaseData.payloads : null;

                    let dropDataArr = updateDatabaseData.dropPayloads.length > 0 ? updateDatabaseData.dropPayloads : null;

                    if (dataArr) {
                        dataArr.forEach(async (tableItem) => {
                            let tableName = tableItem.tableName;
                            let updateData = tableItem.updateData;
                            await updatePartialData(tableName, updateData);
                        })
                    } else {
                        LogServices.log("[DB runMigrations] No Rows need to update.");
                    }
                    if (dropDataArr) {
                        dropDataArr.forEach(async (tableItem) => {
                            let tableName = tableItem.tableName;
                            let dropData = tableItem.dropData;
                            await dropRows(tableName, dropData);
                        })
                    } else {
                        LogServices.log("[DB runMigrations] No Rows need to delete.");
                    }
                } else {
                    LogServices.log("[DB runMigrations] Current app version is too low for database update.");
                }
            } else {
                LogServices.log("[DB runMigrations] Database is already up to date.");
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
        // 使用 Promise.all 并行处理所有数据插入操作
        const insertPromises = defaultData.map(async (data) => {
            const firstField = Object.keys(data)[0];
            const firstValue = data[firstField];

            // 查询表中是否存在具有相同第一个字段值的记录
            const existsQuery = await baseCRUD.queryWhere(tableName, { [firstField]: firstValue });
            if (!existsQuery || existsQuery.length === 0) {
                LogServices.log(`[DB insertDefaultData] Inserting data into ${tableName} with first field '${firstField}' and value '${firstValue}'`);
                return (await baseCRUD.insertRows(tableName, [data])).rowsAffected;
            }
            return 0; // 如果数据已存在，则返回受影响的行数为 0
        });

        // 等待所有插入操作完成
        const results = await Promise.all(insertPromises);
        const rowsAffected = results.reduce((sum, current) => sum + current, 0);

        LogServices.log(`[DB insertDefaultData] Inserted ${rowsAffected} rows into ${tableName}`);
        return true; // 所有数据处理完成
    } catch (error) {
        LogServices.error(`[DB insertDefaultData] Failed to insert default data into ${tableName}:`, error);
        return false;
    }
}


/**
 * 更新部分数据
 * @param tableName 表名
 * @param updateData 需要更新的数据数组 any[]
 * @returns 成功更新的条数
 */
const updatePartialData = async (tableName: string, updateData: any[]): Promise<number> => {
    try {
        // 使用 Promise.all 并行处理所有更新操作
        const updatePromises = updateData.map(async (item) => {
            try {
                // 使用item的第一个键值对作为where条件
                const firstKey = Object.keys(item)[0];
                if (!firstKey) {
                    throw new Error(`无法构建 where 条件: item.where 不包含任何列`);
                }

                const whereCondition = { [firstKey]: item[firstKey] };
                const result = await baseCRUD.updatePartial(tableName, item, whereCondition);

                if (result.success) {
                    LogServices.log(`[updatePartialData] Successfully updated data in table ${tableName}:`, {
                        data: item,
                        where: whereCondition
                    });
                    return true; // 更新成功
                } else {
                    throw new Error(`更新操作返回失败结果`);
                }
            } catch (error) {
                LogServices.error(`[updatePartialData] Failed to update data in table ${tableName}:`, {
                    data: item,
                    error: error
                });
                return false; // 更新失败
            }
        });

        // 等待所有更新操作完成
        const results = await Promise.all(updatePromises);

        // 计算成功更新的条数
        const successCount = results.filter(result => result).length;

        LogServices.log(`[updatePartialData] Update operation completed for table ${tableName}. Success: ${successCount}, Failed: ${results.length - successCount}`);

        return successCount;
    } catch (error) {
        LogServices.error(`[updatePartialData] Error occurred while updating data in table ${tableName}:`, error);
        return 0; // 发生异常时返回0
    }
}

/**
 * 删除数据
 * @param tableName 表名
 * @param dropRow 删除的行
 * @returns Promise<number> - 返回删除的行数
 */
const dropRows = async (tableName: string, dropRow: any[]): Promise<number> => {
    try {
        // 使用 Promise.all 并行处理所有删除操作
        const deletePromises = dropRow.map(async (element) => {
            try {
                LogServices.log(`[dropRows] Deleting row from table ${tableName}: ${JSON.stringify(element)}`);
                const result = await baseCRUD.deleteRow(tableName, element);

                if (result.success) {
                    LogServices.log(`[dropRows] Successfully deleted row from table ${tableName}: ${JSON.stringify(element)}`);
                    return result.rowsAffected || 0; // 返回受影响的行数
                } else {
                    throw new Error(`删除操作返回失败结果`);
                }
            } catch (error) {
                LogServices.error(`[dropRows] Failed to delete row from table ${tableName}:`, {
                    element: element,
                    error: error
                });
                return 0; // 删除失败时返回0
            }
        });

        // 等待所有删除操作完成
        const results = await Promise.all(deletePromises);

        // 计算总的影响行数
        const totalRowsAffected = results.reduce((sum, rowsAffected) => sum + rowsAffected, 0);

        LogServices.log(`[dropRows] Delete operation completed for table ${tableName}. Total rows affected: ${totalRowsAffected}`);

        return totalRowsAffected;
    } catch (error) {
        LogServices.error(`[dropRows] Error occurred while deleting rows from table ${tableName}:`, error);
        return 0; // 发生异常时返回0
    }
};
