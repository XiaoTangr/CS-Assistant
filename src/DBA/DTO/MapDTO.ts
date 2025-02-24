import Database from "@tauri-apps/plugin-sql";
import { DBConn } from "../Utils/DBConn";
import { MapDO } from "../DO/MapDO";

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
    async querybyKey(key: string): Promise<any> {
        const db = await this.db;
        let result = Object.assign({}, await db.select(`SELECT * FROM Map WHERE key = $1`, [key]));
        return result;
    }

    /**
     * query all data
     * @returns MapDO[] - The list of MapDO objects.
     */
    async queryAll(): Promise<MapDO[]> {
        const db = await this.db;
        let results: Array<MapDO> = []
        db.select(`SELECT * FROM Map`).then((rows: any) => {
            rows.forEach((row: any) => {
                results.push(Object.assign({}, row));
            });
        })
        return results;
    }

    /**
     * insert data 
     * @param data - The data to insert.
     */
    async insert(data: Array<any>): Promise<any> {
        const db = await this.db;
        return data.forEach((item: any) => {
            db.execute(`INSERT INTO Map (key, value) VALUES ($1, $2)`, [item.key, item.value])
                .then((r) => { return r; })
                .catch((err: any) => {
                    throw (err);
                });
        });
    }
}