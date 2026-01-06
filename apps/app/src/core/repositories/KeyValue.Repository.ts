import { baseCRUD } from "../database";
import { t_KeyValue } from "../database/models";
import { KeyValue } from "../models";
import { fromDb, toDb } from "../utils";

export default class KeyValueRepository {
    private static instance: KeyValueRepository;
    private readonly TABLE_NAME = "t_KeyValue";

    private constructor() { }

    static getInstance(): KeyValueRepository {
        if (!KeyValueRepository.instance) {
            KeyValueRepository.instance = new KeyValueRepository();
        }
        return KeyValueRepository.instance;
    }


    async findAll(): Promise<KeyValue[]> {
        let res = await baseCRUD.query<t_KeyValue>(this.TABLE_NAME);
        return res.map(item => fromDb(item));
    }

    /**
     * 条件查询
     * @param where
     * @returns t_KeyValue | null
     */
    async findOne(
        where: Record<string, any>
    ): Promise<KeyValue | null> {
        let res = await baseCRUD.queryOne<t_KeyValue>(this.TABLE_NAME, where);
        return res ? fromDb(res) : null;
    }
    async findWhereIn(filter: { [key: string]: string[] }): Promise<KeyValue[]> {
        // 将 filter 转换为符合 QueryOptions 的结构，例如使用 $in 操作符（如果支持）
        let where: Record<string, any> = {};
        for (const [key, values] of Object.entries(filter)) {
            where[key] = { $in: values }; // 假设底层支持 MongoDB 风格的 $in 查询
        }

        let res = await baseCRUD.query<t_KeyValue>(this.TABLE_NAME, where);
        return res.map(item => fromDb(item));
    }

    async update(data: Record<string, any>[], where: Record<string, any>[]): Promise<number> {
        // 构建 {data, where}[]
        let updateData = data.map((item, index) => {
            return {
                data: item,
                where: where[index]
            }
        })
        let res = await baseCRUD.update(this.TABLE_NAME, updateData);
        return res.rowsAffected;
    }
}
