import { dbConnecter } from "./DBConnecter";
import { dbBaseCRUD } from "./DBBaseCRUD";
import { DbData } from "../Sqls/DbData";
export class DBInstaller {

    private static async isTableExists(tableName: string): Promise<boolean> {
        const db = await dbConnecter.getConnection();
        return db.execute(`select * from ${tableName}`).then(() => true).catch(() => false);
    }

    private static async createTable(tableName: string, pk: string, Structure: any[]): Promise<boolean> {
        const db = await dbConnecter.getConnection();
        const StructureString = Structure.map((item) => `${item.name} ${item.type} ${item.nullable ? 'NULL' : 'NOT NULL'}`).join(', ');
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${StructureString}, PRIMARY KEY (${pk}))`;
        return db.execute(sql).then(() => true).catch((e) => {
            throw new Error(e)
        });
    }

    private static async insertDefaultData(tableName: string, Structure: any[]): Promise<boolean> {
        return dbBaseCRUD.insertRows(tableName, Structure).then(() => true).catch(() => false);
    }


    public static async installDB(): Promise<boolean> {
        DbData.forEach(async (item) => {
            if (await this.isTableExists(item.tableName)) return
            this.createTable(item.tableName, item.PK, item.Structure).then(() => {
                this.insertDefaultData(item.tableName, item.defaultData).then(() => {
                    console.log(`insert default data to ${item.tableName} success`)
                }).catch((e) => {
                    console.error(`insert default data to ${item.tableName} fail:${e}`)
                })
                return true
            }).catch((e) => {
                console.error(`create table ${item.tableName} fail:${e}`)
                return false
            })
        })
        return true;
    }

}