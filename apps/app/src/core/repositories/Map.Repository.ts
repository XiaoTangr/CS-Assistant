import { baseCRUD } from "@/core/database";
import { Map } from "@/core/models";
import { fromDb, toDb } from "@/core/utils/serialization/transformer"; // 添加导入

export default class MapRepository {
    private static TABLE_NAME = "t_Map";

    // 根据 key 查询单条数据
    static async queryOneByKey(key: string): Promise<Map | null> {
        const results = await baseCRUD.queryWhere<Map>(
            this.TABLE_NAME,
            { key: key },
        );
        // 使用转换器将数据库结构转换为应用结构
        return results.length > 0 ? fromDb(results[0]) : null;
    }

    // 查询所有数据
    static async queryAll(): Promise<Map[]> {
        const results = await baseCRUD.queryAll<Map>(this.TABLE_NAME) || [];
        // 使用转换器将数据库结构转换为应用结构
        return results.map(item => fromDb(item));
    }

    // 插入多条数据
    static async insert(data: Map[]): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        const dbData = data.map(item => toDb(item));
        return (await baseCRUD.insertRows(this.TABLE_NAME, dbData)).rowsAffected;
    }

    // 删除指定 key 的数据
    static async deleteOneByKeyName(keyName: string): Promise<number> {
        return (await baseCRUD.deleteRow(this.TABLE_NAME, { key: keyName })).rowsAffected;
    }

    // 更新指定 key 的数据
    static async updateByKey(data: Partial<Map>, keyName: string): Promise<number> {
        // 使用转换器将应用结构转换为数据库结构
        const dbData = toDb(data);
        return (await baseCRUD.updateWhere(this.TABLE_NAME, dbData, { key: keyName })).rowsAffected;
    }

    // 获取总数量
    static async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}
