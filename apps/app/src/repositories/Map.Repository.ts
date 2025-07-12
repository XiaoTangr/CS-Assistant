import baseCRUD from "@/core/db/baseCRUD";
import { Map } from "@/models/Map.model";

export default class MapRepository {
    private static TABLE_NAME = "Map";

    // 根据 key 查询单条数据
    static async queryOneByKey(key: string): Promise<Map | null> {
        const results = await baseCRUD.queryWhere<Map>(
            this.TABLE_NAME,
            "key = $1",
            [key]
        );
        return results.length > 0 ? results[0] : null;
    }

    // 查询所有数据
    static async queryAll(): Promise<Map[]> {
        return (await baseCRUD.queryAll<Map>(this.TABLE_NAME)) || [];
    }


    // 插入多条数据
    static async insert(data: Map[]): Promise<number> {
        return await baseCRUD.insertRows(this.TABLE_NAME, data);
    }

    // 删除指定 key 的数据
    static async deleteOneByKeyName(keyName: string): Promise<number> {
        return await baseCRUD.deleteRow(this.TABLE_NAME, "key", keyName);
    }

    // 更新指定 key 的数据
    static async updateByKey(data: Partial<Map>, keyName: string): Promise<number> {
        return await baseCRUD.updateWhere(this.TABLE_NAME, data, { key: keyName });
    }

    // 获取总数量
    static async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}