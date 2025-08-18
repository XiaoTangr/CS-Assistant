import { baseCRUD } from "@/core/database";
import { Map } from "@/core/models";
import { fromDb, toDb } from "@/core/utils/serialization/transformer"; // 添加导入

export default class MapRepository {
    private static TABLE_NAME = "t_Map";

    /**
     * 根据条件查询单条记录
     * @param filter 查询条件
     * @returns 返回匹配的 Map 对象或 null
     */
    static async findOne(filter: Record<string, any>): Promise<Map | null> {
        const results = await baseCRUD.queryWhere<Map>(
            this.TABLE_NAME,
            filter,
        );
        // 使用转换器将数据库结构转换为应用结构
        return results.length > 0 ? fromDb(results[0]) : null;
    }

    /**
     * 查询所有数据
     * @returns 返回所有数据
     */
    static async findAll(): Promise<Map[]> {
        const results = await baseCRUD.queryAll<Map>(this.TABLE_NAME) || [];
        // 使用转换器将数据库结构转换为应用结构
        return results.map(item => fromDb(item));
    }

    /**
     * 根据条件查询记录
     * @param filter 查询条件
     * @returns 返回 Map 数组
     */
    static async findWhere(filter: Record<string, any>): Promise<Map[]> {
        const result = await baseCRUD.queryWhere<Map>(this.TABLE_NAME, filter);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }

    /**
     * 批量插入数据
     * @param payloads 要插入的数据
     * @returns 受影响的行数
     */
    static async bulkCreate(payloads: Map[]): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        const dbData = payloads.map(item => toDb(item));
        return (await baseCRUD.insertRows(this.TABLE_NAME, dbData)).rowsAffected;
    }

    /**
     * 根据条件删除记录
     * @param filter 删除条件
     * @returns 受影响的行数
     */
    static async deleteOne(filter: Record<string, any>): Promise<number> {
        return (await baseCRUD.deleteRow(this.TABLE_NAME, filter)).rowsAffected;
    }

    /**
     * 更新指定记录
     * @param payload 要更新的数据
     * @returns 受影响的行数
     */
    static async updateOne(payload: Map): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        const dbData = toDb(payload);
        return (await baseCRUD.updateWhere(this.TABLE_NAME, dbData, { c_key: payload.key })).rowsAffected;
    }

    /**
     * 统计表中的记录数
     * @returns 返回表中的记录数
     */
    static async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}
