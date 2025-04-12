
import { SQLs } from "../Sqls/SQLs";
import { ElNotification } from "element-plus";
import { dbConnUtil } from "./DBConnUtil";
import { dbCRUDUtil } from "./DBCRUDUtils";

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
            return db.select(sql);
        } catch (e) {
            throw e;
        }
    }

    private async insertDefaultData(): Promise<boolean> {

        const promises: Promise<any>[] = []; // 使用正确的类型注解

        SQLs.forEach((item) => {
            if (item.defaultData.length === 0) return;
            console.log(item.defaultData)
            promises.push(dbCRUDUtil.insertRows(item.tableName, item.defaultData));
        });

        try {
            await Promise.all(promises); // 等待所有插入操作完成
            return true; // 如果所有操作成功，返回true
        } catch (error) {
            console.error('Error inserting default data:', error);
            return false; // 如果有错误发生，返回false
        }
    }



    /**
     *  check if table exists
     * @param tableName the name of table to check
     * @returns true if table exists, false otherwise
     */
    private async isTableExists(tableName: string): Promise<boolean> {
        const db = await dbConnUtil.getConnection();
        return db.execute(`select * from ${tableName}`).then(() => true).catch(() => false);
    }
    /**
    * install database
    */
    public async installDB() {

        SQLs.forEach(async (item) => {
            if (! await this.isTableExists(item.tableName)) {
                this.createTable(item.createSql).then(() => {
                    ElNotification.success(`Database ${item.tableName} installed successfully`)
                    this.insertDefaultData().then(() => {
                        ElNotification.success(`Database ${item.tableName} insert default data successfully`)
                    }).catch((e) => {
                        ElNotification.error(`Database ${item.tableName} insert default data failed, error: ${e}`)
                    })
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