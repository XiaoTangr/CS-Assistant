import { jsonUtil } from "@/utils/JSONUtil";
import { SettingsDO } from "../DO/SettingsDO";
import { dbCUDRUtil } from "../Utils/DBCUDRUtil";


export default class SettingsDTO {
    static async queryOneByKey(key: string) {
        // return await dbCUDRUtil.queryOne<SettingsDO | null>("Settings", "key", key)
        return jsonUtil.deepParseJSON(await dbCUDRUtil.queryOne<SettingsDO | null>("Settings", "key", key))
    }
    static async queryAll() {
        // return await dbCUDRUtil.queryAll<SettingsDO[] | null>("Settings")
        return jsonUtil.deepParseJSON(await dbCUDRUtil.queryAll<SettingsDO[] | null>("Settings"))
    }
    static async updateRow(row: SettingsDO): Promise<number> {
        return await dbCUDRUtil.updateRow("Settings", row, "key", row.key)
    }

    static async updateRows(rows: SettingsDO[]): Promise<number> {
        return await dbCUDRUtil.updateRows("Settings", rows, "key")
    }

    static async insertRow(rows: SettingsDO[]): Promise<number> {
        return await dbCUDRUtil.insertRows("Settings", rows)
    }

    static async deleteRow(key: string): Promise<number> {
        return await dbCUDRUtil.deleteRow("Settings", "key", key)
    }

    static async useDefaultData() {
        throw new Error("Method not implemented.")
        // TODO: 使用默认数据

    }
}