import { jsonUtil } from "@/utils/JSONUtil";
import { SettingsDO } from "../DO/SettingsDO";
import { dbCRUDUtil } from "../Utils/DBCRUDUtils";


export default class SettingsDAO {
    static async queryOneByKey(key: string) {
        // return await dbCRUDUtil.queryOne<SettingsDO | null>("Settings", "key", key)
        return jsonUtil.deepParseJSON(await dbCRUDUtil.queryOne<SettingsDO | null>("Settings", "key", key))
    }
    static async queryAll() {
        // return await dbCRUDUtil.queryAll<SettingsDO[] | null>("Settings")
        return jsonUtil.deepParseJSON(await dbCRUDUtil.queryAll<SettingsDO[] | null>("Settings"))
    }
    static async updateRow(row: SettingsDO): Promise<number> {
        return await dbCRUDUtil.updateRow("Settings", row, "key", row.key)
    }

    static async updateRows(rows: SettingsDO[]): Promise<number> {
        return await dbCRUDUtil.updateRows("Settings", rows, "key")
    }

    static async insertRow(rows: SettingsDO[]): Promise<number> {
        return await dbCRUDUtil.insertRows("Settings", rows)
    }

    static async deleteRow(key: string): Promise<number> {
        return await dbCRUDUtil.deleteRow("Settings", "key", key)
    }

    static async useDefaultData() {
        throw new Error("Method not implemented.")
        // TODO: 使用默认数据

    }
}