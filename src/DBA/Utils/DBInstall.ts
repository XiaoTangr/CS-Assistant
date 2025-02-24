import { DBConn } from "./DBConn";
import { SQLs } from "../Sqls/SQLs";
import { ElNotification } from "element-plus";

/**
 *  create table by sqlstr
 * @param sql the sqlstr of create table
 */
const createTable = async (sql: string) => {
    const db = await new DBConn().init();
    const query = sql;
    db.execute(query).then(() => true).catch((e) => { throw e });
}

/**
 *  check if table exists
 * @param tableName the name of table to check
 * @returns true if table exists, false otherwise
 */
const isTableExists = async (tableName: string): Promise<boolean> => {
    const db = await new DBConn().init();
    return db.execute(`select * from ${tableName}`).then(() => true).catch(() => false);
}

/**
 * install database
 */
export const DBinstall = async () => {
    SQLs.forEach(async (item) => {
        if (! await isTableExists(item.tableName)) {
            createTable(item.createSql).then(() => {
                ElNotification.success(`Database ${item.tableName} installed successfully`)
            }).catch((e) => {
                console.error(e);
                ElNotification.error(`Database ${item.tableName} install failed, error: ${e}`)
            });
        } else {
            ElNotification.info(`Database ${item.tableName} already exists`)
        }
    });
}