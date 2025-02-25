import Database from "@tauri-apps/plugin-sql";
import { DBConn } from "../Utils/DBConn";
import { SettingsDO } from "../DO/SettingsDO";
import { simpleQueryAll, simpleQueryOneByColumnName } from "../Utils/SimpleCUDRUtil";

export default class SettingsDTO {
    // @ts-ignore
    private db!: Promise<Database>;


    constructor() {
        this.db = this.db = new DBConn().init();
    }
    async queryOneByKey(key: string) {
        return await simpleQueryOneByColumnName<SettingsDO | null>("Settings", "key", key);
    }

    async queryAll() {
        return await simpleQueryAll<SettingsDO[] | null>("Settings")
    }
}