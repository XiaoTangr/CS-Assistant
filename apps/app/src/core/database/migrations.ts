
import dbData from "./dbData.json5?raw";
import { LogService } from "../services";
import { baseCRUD } from "../database";
import { json5, versionComparator } from "../utils";
import { getVersion } from '@tauri-apps/api/app';
import { t_Map } from "./models";
interface TableColumns {
    name: string;
    type: string;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    notNull?: boolean;
    unique?: boolean;
    default?: string;
}


/**
 * 创建数据库表Sql语句生成器
 * @param tableName 表名
 * @param columns 列定义
 * @param config {}
 */
const buildCreateTableSql = (
    tableName: string,
    columns: TableColumns[],
): string => {
    // 构建列定义
    const columnDefinitions = columns.map(column => {
        let columnDefinition = `${column.name} ${column.type}`;
        if (column.primaryKey === true) columnDefinition += ' PRIMARY KEY';
        if (column.notNull !== false) columnDefinition += ' NOT NULL';
        if (column.unique === true) columnDefinition += ' UNIQUE';
        if (column.autoIncrement === true) columnDefinition += ' AUTOINCREMENT';
        if (column.default !== undefined) columnDefinition += ` DEFAULT '${column.default}'`;
        return columnDefinition;
    }).join(', ');

    // 构建完整的 SQL 语句
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;

    return sql;
}

/**
 * 获取数据库迁移数据
*/
const getMigrationData = async () => {
    try {
        // 获取database数据
        let data: any = await json5.deepParse(dbData);
        if (!data) throw new Error('No data found.');
        return data;
    } catch (error) {
        LogService.error(error);
        throw new Error(`[DatabaseService.getMigrationData] 获取数据库迁移数据失败: ${error}`);
    }
}



/**
 * 检查是否需要执行数据库迁移
 * @returns true if need migration
 */
export const needMigration = async () => {
    // 获取database数据
    let data: any = await getMigrationData();
    let currentAppVersion = await getVersion();
    let needAppVersion = data.needAppVersion;
    let setDBVersion = data.setDBVersion;
    let currentDBVersion = "-1";
    try {
        let sqlStr = "select c_value from t_Map where c_key='db_version';"
        let Rows: any[] = (await baseCRUD.executeRaw(sqlStr)).data
        if (Rows && Rows.length > 0) {
            currentDBVersion = Rows[0]?.c_value ?? "0.0.0";
        } else {
            currentDBVersion = "0.0.0";
        }
    } catch (error) {
        LogService.error(error);
        currentDBVersion = "0.0.0";
    }
    // 检查应用版本是否符合要求
    // 首先判断app版本是否高于needAppVersion，如果是，则判断db版本是否需要更新
    if (versionComparator(currentAppVersion, needAppVersion) >= 0) {
        // 检查数据库版本是否需要更新
        if (versionComparator(currentDBVersion, setDBVersion) < 0) {
            LogService.log(`[DatabaseService.needMigration] 数据库版本需要更新，当前版本为${currentDBVersion}，需要更新版本为${setDBVersion}`);
            // 执行更新逻辑
            return true;
        } else {
            LogService.log(`[DatabaseService.needMigration] 数据库版本无需更新，当前版本为${currentDBVersion}`);
            return false;
        }
    } else {
        LogService.log(`[DatabaseService.needMigration] 应用版本低于需要更新的版本，当前版本为${currentAppVersion}，需要更新版本为${needAppVersion}`);
        return false;
    }
}

/**
 * 数据库迁移
 */
export const runMigrations = async () => {
    try {
        // 获取 migration 数据
        let data: any = await getMigrationData();
        let tables = data.tables;

        // 使用 Promise.all 并行处理每个表
        await Promise.all(tables.map(async (tableItem: any) => {
            try {
                let tableName = tableItem.name;
                let columns = tableItem.columns;

                // 1. 检查表是否存在
                let isTableExist = await baseCRUD.executeRaw('SELECT * FROM sqlite_master WHERE type="table" AND name="' + tableName + '"');

                if (isTableExist.data.length === 0) {
                    // 创建表
                    let createSqlstr = buildCreateTableSql(tableName, columns);
                    await baseCRUD.executeRaw(createSqlstr);
                    LogService.log(`[DatabaseService.installDB] [${tableName}] 创建表成功`);
                }

                // 2. 插入默认数据
                let defData: any[] = tableItem.defData ?? [];
                if (defData.length > 0) {
                    // 构造 queryWhereIn 所需的过滤条件
                    const filterKey = Object.keys(defData[0])[0];
                    const filterValues = defData.map(dataItem => dataItem[filterKey]);
                    const filters = { [filterKey]: filterValues };

                    // 批量查询现有数据
                    const existingRows = await baseCRUD.queryWhereIn(tableName, filters);

                    // 筛选出需要插入的数据项
                    const rowsToInsert = defData.filter(dataItem => {
                        const filterValue = dataItem[filterKey];
                        return !existingRows.some((row: any) => row[filterKey] === filterValue);
                    });

                    if (rowsToInsert.length > 0) {
                        const insertRows = rowsToInsert.map(dataItem => json5.deserializeValues(dataItem));
                        await baseCRUD.insertRows(tableName, insertRows); // 批量插入
                        LogService.log(`[DatabaseService.installDB] [${tableName}] 批量插入 ${rowsToInsert.length} 条数据成功`);
                    }
                    LogService.log(`[DatabaseService.installDB] [${tableName}] 插入全部默认数据成功`);
                }

                // 3. 更新数据 和 插入新数据
                let updateData: any[] = tableItem.updateData ?? [];
                if (updateData.length > 0) {
                    LogService.log(`[DatabaseService.installDB] [${tableName}] 更新数据开始`);

                    // 构造 queryWhereIn 所需的过滤条件
                    const filterKey = Object.keys(updateData[0])[0];
                    const filterValues = updateData.map(dataItem => dataItem[filterKey]);
                    const filters = { [filterKey]: filterValues };

                    // 批量查询现有数据
                    const existingUpdateRows = await baseCRUD.queryWhereIn(tableName, filters);

                    // 并行处理更新和插入
                    await Promise.all(updateData.map(async (dataItem) => {
                        const filter = { [filterKey]: dataItem[filterKey] };

                        const existingRow = existingUpdateRows.find((row: any) => row[filterKey] === dataItem[filterKey]);
                        if (existingRow) {
                            // 如果数据存在，则更新
                            await baseCRUD.updateWhere(tableName, dataItem, filter);
                            LogService.log(`[DatabaseService.installDB] [${tableName}] 更新数据成功:%o`, dataItem);
                        } else {
                            // 如果数据不存在，则插入
                            await baseCRUD.insertRows(tableName, [dataItem]);
                            LogService.log(`[DatabaseService.installDB] [${tableName}] 插入数据成功:%o`, dataItem);
                        }
                    }));
                    LogService.log(`[DatabaseService.installDB] [${tableName}] 更新数据完成`);
                }

                // 4. 删除数据
                let dropData: any[] = tableItem.dropData ?? [];
                if (dropData.length > 0) {
                    LogService.log(`[DatabaseService.installDB] [${tableName}] 删除数据开始`);
                    // 批量删除
                    const deleteFilters = dropData.map(dataItem => {
                        const filterKey = Object.keys(dataItem)[0];
                        return { [filterKey]: dataItem[filterKey] };
                    });
                    await baseCRUD.deleteRows(tableName, deleteFilters); // 假设支持批量删除
                    LogService.log(`[DatabaseService.installDB] [${tableName}] 删除数据完成`);
                }

                // 5. 更新 db_version
                let row: t_Map = {
                    c_key: "db_version",
                    c_value: data.setDBVersion
                };
                await baseCRUD.updateWhere("t_Map", row, { c_key: "db_version" });
                LogService.log(`[DatabaseService.installDB] [${tableName}] 更新 db_version 成功`);
                LogService.log(`[DatabaseService.installDB] [${tableName}] 安装完成`);
            } catch (error) {
                LogService.error('[DatabaseService.installDB] 发生错误:', error);
                throw error;
            }
        }));

        LogService.log('[DatabaseService.installDB] 数据库安装完成');
        return true;
    } catch (error) {
        LogService.error('[DatabaseService.installDB] 数据库安装失败:', error);
        throw error;
    }
}
