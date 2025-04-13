import { jsonUtil } from "@/utils/JSONUtil";
import { SettingsDO } from "../DO/SettingsDO";
import { dbBaseCRUD } from "../DA/DBBaseCRUD";


export default class SettingsDAO {
    /**
     * query one row by key
     * @param key - The key to query by.
     * @returns the queried row, or null if not found
     */
    static async queryOneByKey(key: string) {
        return jsonUtil.deepParseJSON(await dbBaseCRUD.queryOne<SettingsDO | null>("Settings", "key", key))
    }

    /**
     * query all rows from Settings table
     * @returns the queried rows, or null if none found
     */
    static async queryAll() {
        return jsonUtil.deepParseJSON(await dbBaseCRUD.queryAll<SettingsDO[] | null>("Settings"))
    }
    /**
     * Update a row in the Settings table
     * @param row the row data to update
     * @returns the number of affected rows
     */
    static async updateRow(row: SettingsDO): Promise<number> {
        return await dbBaseCRUD.updateRow("Settings", row, "key", row.key)
    }

    /**
     * Update multiple rows in the Settings table
     * @param rows - An array of SettingsDO objects to update
     * @returns The number of rows that were updated
     */
    static async updateRows(rows: SettingsDO[]): Promise<number> {
        return await dbBaseCRUD.updateRows("Settings", rows, "key")
    }

    /**
     * Insert multiple rows into the Settings table
     * @param rows - An array of SettingsDO objects to insert
     * @returns The number of rows that were inserted
     */

    static async insertRow(rows: SettingsDO[]): Promise<number> {
        return await dbBaseCRUD.insertRows("Settings", rows)
    }

    /**
     * Delete a row from the Settings table
     * @param key - The key of the row to delete
     * @returns The number of rows that were deleted
     */
    static async deleteRow(key: string): Promise<number> {
        return await dbBaseCRUD.deleteRow("Settings", "key", key)
    }

    static async useDefaultData() {
        throw new Error("Method not implemented.")
        // TODO: 使用默认数据

    }
}