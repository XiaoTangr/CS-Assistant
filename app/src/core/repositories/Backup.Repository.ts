import { baseCRUD } from "@/core/database";
import { Backup } from "../models";
import { fromDb, toDb } from "../utils";

export default class BackupRepository {
    private static instance: BackupRepository;
    private readonly TABLE_NAME = "t_Backup";

    private constructor() { }

    static getInstance(): BackupRepository {
        if (!BackupRepository.instance) {
            BackupRepository.instance = new BackupRepository();
        }
        return BackupRepository.instance;
    }

    /**
     * 根据条件查询单条记录
     * @param filter 查询条件
     * @returns 返回匹配的 Backup 对象或 null
     */
    async findOne(filter: Record<string, any>): Promise<Backup | null> {
        const results = await baseCRUD.queryOne<Backup>(
            this.TABLE_NAME,
            filter,
        );
        return results ? fromDb(results) : null;
    }

    /**
     * 查询所有备份和恢复数据
     * @returns 所有数据
     */
    async findAll(): Promise<Backup[]> {
        let res = await baseCRUD.query<Backup>(this.TABLE_NAME)
        return res.map(item => fromDb(item))
    }

    /**
     * 根据条件查询记录
     * @param filter 查询条件
     * @returns 返回 Backup 数组
     */
    async findWhere(filter: Record<string, any>): Promise<Backup[]> {
        const result = await baseCRUD.query<Backup>(this.TABLE_NAME, filter);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }


    /**
     * 分页查询备份和恢复数据
     * @param page 当前页码
     * @param limit 每页数量
     * @returns 分页数据
     */
    async findPaginated(page: number, limit: number): Promise<Backup[]> {
        let res = await baseCRUD.paginate(this.TABLE_NAME, page, limit)
        return res.data.map(item => fromDb(item))
    }

    /**
     * 批量插入备份和恢复数据
     * @param payloads 备份和恢复数据数组
     * @returns 受影响的行数
     */
    async bulkCreate(payloads: Backup[]): Promise<number> {
        let res = await baseCRUD.insert(this.TABLE_NAME, payloads.map(item => toDb(item)));
        return res.rowsAffected;
    }

    /**
     * 更新指定备份和恢复数据
     * @param payload 备份和恢复数据对象
     * @returns 受影响的行数
     */
    async updateOne(payload: Backup): Promise<number> {
        let res = await baseCRUD.update(
            this.TABLE_NAME,
            toDb(payload),
            { id: payload.id }
        );
        return res.rowsAffected;

    }

    /**
     * 根据条件删除记录
     * @param filter 删除条件
     * @returns 受影响的行数
     */
    async deleteOne(filter: Record<string, any>): Promise<number> {
        let res = await baseCRUD.delete(this.TABLE_NAME, filter);
        return res.rowsAffected;
    }

    /**
     * 统计表中的记录数
     * @returns 记录总数
     */
    async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}
