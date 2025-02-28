
import { SQLs } from "../Sqls/SQLs";
import { ElNotification } from "element-plus";
import { dbConnUtil } from "./DBConnUtil";

class DBinstallUtil {
    private static instance: DBinstallUtil


    private constructor() { }

    public static getInstance(): DBinstallUtil {
        if (!DBinstallUtil.instance) {
            DBinstallUtil.instance = new DBinstallUtil();
        }
        return DBinstallUtil.instance;
    }
    /**
     *  create table by sqlstr
     * @param sql the sqlstr of create table
     */
    private async createTable(sql: string): Promise<boolean> {
        const db = await dbConnUtil.getConnection();
        try {
            return (await db).select(sql);
        } catch (e) {
            throw e;
        }
    }
    /**
     *  check if table exists
     * @param tableName the name of table to check
     * @returns true if table exists, false otherwise
     */
    private async isTableExists(tableName: string): Promise<boolean> {
        const db = await dbConnUtil.getConnection();
        return (await db).execute(`select * from ${tableName}`).then(() => true).catch(() => false);
    }
    /**
    * install database
    */
    public async installDB() {
        SQLs.forEach(async (item) => {
            if (! await this.isTableExists(item.tableName)) {
                this.createTable(item.createSql).then(() => {
                    ElNotification.success(`Database ${item.tableName} installed successfully`)
                }).catch((e) => {
                    ElNotification.error(`Database ${item.tableName} install failed, error: ${e}`)
                });
            } else {
                ElNotification.error(`Database ${item.tableName} already exists`)
            }
        });
    }

}
export const dbinstallUtil = DBinstallUtil.getInstance();