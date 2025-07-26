import { parse } from "@/core/utils/serialization";
import { baseCRUD } from "@/core/database";
import { Settings } from "@/core/models";

export default class SettingsRepository {
    private static TABLE_NAME = "Settings";

    /**
     * 根据 key 查询单条记录
     * @param key - 要查询的 key 字段值
     * @returns 返回匹配的 Settings 对象或 null
     */
    static async queryOneByKey(key: string): Promise<Settings | null> {
        const result = await baseCRUD.queryWhere<Settings>(
            this.TABLE_NAME,
            "key = $1",
            [key]
        );
        return result.length > 0 ? parse(result[0]) : null;
    }

    /**
     * 查询所有 Settings 数据
     * @returns 返回 Settings 数组
     */
    static async queryAll(): Promise<Settings[]> {
        const result = await baseCRUD.queryWhere<Settings>(this.TABLE_NAME, "1=1");
        return result.map((item) => parse(item));
    }

    /**
     * 更新一条记录
     * @param row - 要更新的 Settings 对象
     * @returns 受影响行数
     */
    static async updateRow(row: Settings): Promise<number> {
        return await baseCRUD.updateWhere(this.TABLE_NAME, row, { key: row.key });
    }

    /**
     * 批量更新记录
     * @param rows - 要更新的 Settings 对象数组
     * @returns 受影响行数
     */
    static async updateRows(rows: Settings[]): Promise<number> {
        let updatedCount = 0;
        for (const row of rows) {
            const affected = await this.updateRow(row);
            updatedCount += affected;
        }
        return updatedCount;
    }

    /**
     * 插入多条记录
     * @param rows - 要插入的 Settings 对象数组
     * @returns 受影响行数
     */
    static async insertRows(rows: Settings[]): Promise<number> {
        return await baseCRUD.insertRows(this.TABLE_NAME, rows);
    }


    /**
     * 删除指定 key 的记录
     * @param key - 要删除的 key 值
     * @returns 受影响行数
     */
    static async deleteRow(key: string): Promise<number> {
        return await baseCRUD.deleteRow(this.TABLE_NAME, "key", key);
    }

    /**
     * 使用默认数据（待实现）
     */
    static async useDefaultData() {
        throw new Error("Method not implemented.");
        // TODO: 使用默认数据
    }
}