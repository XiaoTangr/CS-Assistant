import { SettingsDO } from "../DO/SettingsDO";
import { dbCUDRUtil } from "../Utils/DBCUDRUtil";


export default class SettingsDTO {
    static async queryOneByKey(key: string) {
        return await dbCUDRUtil.queryOne<SettingsDO | null>("Settings", "key", key);
    }
    static async queryAll() {
        return await dbCUDRUtil.queryAll<SettingsDO[] | null>("Settings")
    }
    static async updateRow(row: SettingsDO): Promise<boolean> {
        return await dbCUDRUtil.updateRow("Settings", row, "key", row.key)
    }
}