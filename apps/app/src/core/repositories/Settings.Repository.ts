import { baseCRUD } from "@/core/database";
import { Settings } from "@/core/models";
import { fromDb, toDb } from "@/core/utils/serialization/transformer"; // 添加导入

export default class SettingsRepository {

    private static TABLE_NAME = "t_Settings";

    /**
     * 根据条件查询单条记录
     * @param filter 查询条件
     * @returns 返回匹配的 Settings 对象或 null
     */
    static async findOne(filter: Record<string, any>): Promise<Settings | null> {
        const result = await baseCRUD.queryWhere<Settings>(
            this.TABLE_NAME,
            filter
        );
        // 使用转换器将数据库结构转换为应用结构
        return result.length > 0 ? fromDb(result[0]) : null;
    }

    /**
     * 查询所有 Settings 数据
     * @returns 返回 Settings 数组
     */
    static async findAll(): Promise<Settings[]> {
        const result = await baseCRUD.queryAll<Settings>(this.TABLE_NAME);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }

    /**
     * 根据条件查询记录
     * @param filter 查询条件
     * @returns 返回 Settings 数组
     */
    static async findWhere(filter: Record<string, any>): Promise<Settings[]> {
        const result = await baseCRUD.queryWhere<Settings>(this.TABLE_NAME, filter);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }

    /**
     * 更新一条记录
     * @param payload 要更新的 Settings 对象
     * @returns 受影响行数
     */
    static async updateOne(payload: Settings): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        return (await baseCRUD.updateWhere(this.TABLE_NAME, toDb(payload), { c_key: payload.key })).rowsAffected;
    }

    /**
     * 批量更新记录
     * @param payloads 要更新的 Settings 对象数组
     * @returns 受影响行数
     */
    static async bulkUpdate(payloads: Settings[]): Promise<number> {
        let updatedCount = 0;
        for (const payload of payloads) {
            // 使用转换器将应用结构转换为数据库结构
            const affected = await this.updateOne(payload);
            updatedCount += affected;
        }
        return updatedCount;
    }

    /**
     * 批量插入记录
     * @param payloads 要插入的 Settings 对象数组
     * @returns 受影响行数
     */
    static async bulkCreate(payloads: Settings[]): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        const dbRows = payloads.map(row => toDb(row));
        return (await baseCRUD.insertRows(this.TABLE_NAME, dbRows)).rowsAffected;
    }

    /**
     * 删除指定 key 的记录
     * @param filter 删除条件
     * @returns 受影响行数
     */
    static async deleteOne(filter: Record<string, any>): Promise<number> {
        return (await baseCRUD.deleteRow(this.TABLE_NAME, filter)).rowsAffected;
    }

    /**
     * 统计表中的记录数
     * @returns 记录总数
     */
    static async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}
