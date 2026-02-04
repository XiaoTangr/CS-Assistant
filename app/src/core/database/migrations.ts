import { LogService } from "../services";
import { baseCRUD } from ".";
import { t_KeyValue } from "./models";

import { appConfigs } from "../static/appConfig";
import { AppConfig } from "../models";
import { dbData } from "../static";
import { KeyValueRepository } from "../repositories";


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
        let data: any = dbData;
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
    let need = true
    await KeyValueRepository.getInstance().findOne({ c_key: 'db_installed' }).then(res => {
        if (res) {
            need = false
        }
    }).catch(error => {
        LogService.error(error);
        need = true;
    });
    return need;
}

/**
 * 数据库迁移
 */
export const runMigrations = async () => {

    // 尝试构建数据库
    let data: any = await getMigrationData();
    let tables = data.tables;

    await Promise.all(tables.map(async (tableItem: any) => {
        // 创建表
        let tableName = tableItem.name;
        let columns = tableItem.columns;


        let isTableExist = (await baseCRUD.selectRaw('SELECT * FROM sqlite_master WHERE type="table" AND name="' + tableName + '"'));


        LogService.debug(isTableExist)

        if (isTableExist.length === 0) {
            // 创建表

            let createSqlstr = buildCreateTableSql(tableName, columns);
            await baseCRUD.executeRaw(createSqlstr);
            LogService.log(`[DatabaseService.installDB] [${tableName}] 创建表成功`);
        }
        // 插入数据(只有键值对表需要插入数据)
        if (tableName === "t_KeyValue") {
            let staticData = appConfigs as AppConfig[];

            // 预处理数据，构建插入数据
            let builtData: t_KeyValue[];

            builtData = staticData.map(item => {
                return {
                    c_key: item.key,
                    c_value: item.value,
                }
            });

            // 添加 tableItem.defData 中的数据
            if (tableItem.defData && Array.isArray(tableItem.defData)) {
                builtData = [...builtData, ...tableItem.defData];
            }

            // 批量插入，需要先检查是否已经存在
            // 构造 queryWhereIn 所需的过滤条件
            const filterKey = "c_key";
            let filterValues = builtData.map(dataItem => dataItem[filterKey]);
            const existingRows = await baseCRUD.query(tableName, {
                where: {
                    [filterKey]: {
                        in: filterValues
                    }
                }
            });
            // 构建需要插入的数据
            let rowsToInsert = builtData.filter(dataItem => !existingRows.some((row: any) => row[filterKey] === dataItem[filterKey]));

            // 批量插入
            LogService.debug(rowsToInsert)
            await baseCRUD.insert(tableName, rowsToInsert);
        }
    }))

    let db_installed = {
        c_key: "db_installed",
        c_value: "true",
    }
    await baseCRUD.insert<t_KeyValue>("t_KeyValue", db_installed);

}
