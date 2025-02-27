import { SettingsDO } from "../DO/SettingsDO";
import { dbCUDRUtil } from "../Utils/DBCUDRUtil";


export default class SettingsDTO {

    async queryOneByKey(key: string) {
        return await dbCUDRUtil.queryOne<SettingsDO | null>("Settings", "key", key);
    }

    async queryAll() {
        return await dbCUDRUtil.queryAll<SettingsDO[] | null>("Settings")
    }
}