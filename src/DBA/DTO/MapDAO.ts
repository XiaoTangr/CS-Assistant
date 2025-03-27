import { MapDO } from "../DO/MapDO";
import { dbCRUDUtil } from "../Utils/DBCRUDUtils";
import { dbConnUtil } from "../Utils/DBConnUtil";

export default class MapDAO {
    /**
     * query data by key
     * @param key - The key to query by.
     * @returns 
     */
    static async queryOnebyKey(key: string): Promise<any> {
        return await dbCRUDUtil.queryOne<MapDO | null>("Settings", "key", key);
    }

    /**
     * query all data
     * @returns MapDO[] - The list of MapDO objects.
     */
    static async queryAll() {
        return await dbCRUDUtil.queryAll<MapDO[] | null>("Map")
    }

    /**
     * insert data 
     * @param data - The data to insert.
     */
    static async insert(data: Array<MapDO>): Promise<any> {
        const db = await dbConnUtil.getConnection();
        return data.forEach((item: any) => {
            db.execute(`INSERT INTO Map (key, value) VALUES ($1, $2)`, [item.key, item.value])
                .then((r) => { return r; })
                .catch((err: any) => {
                    throw (err);
                });
        });
    }

    static async deleteOneByKeyName(KeyName: string): Promise<any> {
        return await dbCRUDUtil.deleteRow("Map", "key", KeyName);
    }
}