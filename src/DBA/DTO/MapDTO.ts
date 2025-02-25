import Database from "@tauri-apps/plugin-sql";
import { DBConn } from "../Utils/DBConn";
import { MapDO } from "../DO/MapDO";
import { simpleDeleteByColumnName, simpleInsert, simpleQueryAll, simpleQueryOneByColumnName } from "../Utils/SimpleCUDRUtil";

export default class MapDTO {
    private db!: Promise<Database>;

    constructor() {
        this.db = new DBConn().init();
    }

    /**
     * query data by key
     * @param key - The key to query by.
     * @returns 
     */
    async queryOnebyKey(key: string): Promise<any> {
        return await simpleQueryOneByColumnName<MapDO | null>("Settings", "key", key);
    }

    /**
     * query all data
     * @returns MapDO[] - The list of MapDO objects.
     */
    async queryAll() {
        return await simpleQueryAll<MapDO[] | null>("Map")
    }

    /**
     * insert data 
     * @param data - The data to insert.
     */
    async insert(data: Array<MapDO>): Promise<any> {
        const db = await this.db;
        return data.forEach((item: any) => {
            db.execute(`INSERT INTO Map (key, value) VALUES ($1, $2)`, [item.key, item.value])
                .then((r) => { return r; })
                .catch((err: any) => {
                    throw (err);
                });
        });
    }

    async deleteOneByKeyName(KeyName: string): Promise<any> {
        return await simpleDeleteByColumnName("Map", "key", KeyName);
    }

    async it(data: MapDO[]) {
        return await simpleInsert("Map", data)
    }
}