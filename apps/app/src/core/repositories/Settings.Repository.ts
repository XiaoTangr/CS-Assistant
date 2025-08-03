import { baseCRUD } from "@/core/database";
import { Settings } from "@/core/models";
import { fromDb, toDb } from "@/core/utils/serialization/transformer"; // 添加导入

export default class SettingsRepository {

    private static TABLE_NAME = "t_Settings";

    /**
     * 根据 key 查询单条记录
     * @param key - 要查询的 key 字段值
     * @returns 返回匹配的 Settings 对象或 null
     */
    static async queryOneByKey(key: string): Promise<Settings | null> {
        const result = await baseCRUD.queryWhere<Settings>(
            this.TABLE_NAME,
            { c_key: key }
        );
        // 使用转换器将数据库结构转换为应用结构
        return result.length > 0 ? fromDb(result[0]) : null;
    }

    /**
     * 查询所有 Settings 数据
     * @returns 返回 Settings 数组
     */
    static async queryAll(): Promise<Settings[]> {
        const result = await baseCRUD.queryAll<Settings>(this.TABLE_NAME);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }

    /**
     * where查询
     * @param where 查询条件
     * @returns
     */
    static async queryWhere(where: Record<string, any>): Promise<Settings[]> {
        const result = await baseCRUD.queryWhere<Settings>(this.TABLE_NAME, where);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }



    /**
     * 更新一条记录
     * @param row - 要更新的 Settings 对象
     * @returns 受影响行数
     */
    static async updateRow(row: Settings): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        return await baseCRUD.updateWhere(this.TABLE_NAME, toDb(row), { c_key: row.key });
    }

    /**
     * 批量更新记录
     * @param rows - 要更新的 Settings 对象数组
     * @returns 受影响行数
     */
    static async updateRows(rows: Settings[]): Promise<number> {
        let updatedCount = 0;
        for (const row of rows) {
            // 使用转换器将应用结构转换为数据库结构
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
        // 使用转换器将应用结构转换为数据库结构
        const dbRows = rows.map(row => toDb(row));
        return await baseCRUD.insertRows(this.TABLE_NAME, dbRows);
    }

    // 删除指定 key 的记录
    static async deleteRow(key: string): Promise<number | PromiseLike<number>> {
        return await baseCRUD.deleteRow(this.TABLE_NAME, { c_key: key });
    }
    /**
     * 使用默认数据（待实现）
     */
    static async useDefaultData() {
        throw new Error("Method not implemented.");
        // TODO: 使用默认数据
    }
}
