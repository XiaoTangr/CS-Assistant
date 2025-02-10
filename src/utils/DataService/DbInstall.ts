import Database from '@tauri-apps/plugin-sql';

import { appSettingsSQL } from './sqls/appSettings';
import { tr } from 'element-plus/es/locales.mjs';


class DBCoon {
    private db: Promise<Database>;

    constructor() {
        this.db = this.dbLoad();
    }

    dbLoad = async () => {
        return await Database.load("sqlite:cs2h.db")
    }

    installCheck = async () => {
        const db = await this.db;
        try {
            this.tableCreate();
            let result: any = await db.select("select * from appSettings where key = 'DBInstalled';")
            console.log(JSON.parse(result[0].desc))
            if (result.length > 0) {
                return true;
            }
        } catch (err: unknown) {
            return false;
        }
    }

    tableCreate = async () => {
        const sql = appSettingsSQL[0].sql;
        (await this.db).execute(sql);
    }

    dataInsert = async () => {
        const db = await this.db;
        const sql = appSettingsSQL[1].sql;
        await db.execute(sql);
    }

}

export default DBCoon