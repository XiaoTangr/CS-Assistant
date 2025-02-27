import Database from "@tauri-apps/plugin-sql";
import { DBConn } from "../Utils/DBConn";
import { SettingsDO } from "../DO/SettingsDO";
import { dbCUDRUtil } from "../Utils/DBCUDRUtil";


export default class SettingsDTO {
    // @ts-ignore
    private db!: Promise<Database>;


    constructor() {
        this.db = this.db = new DBConn().init();
    }
    async queryOneByKey(key: string) {
        return await dbCUDRUtil.queryOne<SettingsDO | null>("Settings", "key", key);
    }

    async queryAll() {
        return await dbCUDRUtil.queryAll<SettingsDO[] | null>("Settings")
    }
}