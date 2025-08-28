import { baseCRUD } from "@/core/database";
import { BackupAndRecovery } from "../models";
import { fromDb, toDb } from "../utils";

export default class BackupAndRecoveryRepository {

    private static TABLE_NAME = "t_BackupAndRecovery";

    /**
     * 根据条件查询单条记录
     * @param filter 查询条件
     * @returns 返回匹配的 BackupAndRecovery 对象或 null
     */
    static async findOne(filter: Record<string, any>): Promise<BackupAndRecovery | null> {
        const results = await baseCRUD.queryWhere<BackupAndRecovery>(
            this.TABLE_NAME,
            filter,
        );
        return fromDb(results[0]);
    }

    /**
     * 查询所有备份和恢复数据
     * @returns 所有数据
     */
    static async findAll(): Promise<BackupAndRecovery[]> {
        return fromDb<BackupAndRecovery[]>((await baseCRUD.queryAll<BackupAndRecovery>(this.TABLE_NAME)) ?? []);
    }

    /**
     * 根据条件查询记录
     * @param filter 查询条件
     * @returns 返回 BackupAndRecovery 数组
     */
    static async findWhere(filter: Record<string, any>): Promise<BackupAndRecovery[]> {
        const result = await baseCRUD.queryWhere<BackupAndRecovery>(this.TABLE_NAME, filter);
        // 使用转换器将数据库结构转换为应用结构
        return result ? result.map((item) => fromDb(item)) : [];
    }


    /**
     * 分页查询备份和恢复数据
     * @param page 当前页码
     * @param limit 每页数量
     * @returns 分页数据
     */
    static async findPaginated(page: number, limit: number): Promise<BackupAndRecovery[]> {
        return fromDb<BackupAndRecovery[]>((await baseCRUD.queryWithOffset<BackupAndRecovery>(this.TABLE_NAME, page, limit, "c_id")) ?? []);
    }

    /**
     * 批量插入备份和恢复数据
     * @param payloads 备份和恢复数据数组
     * @returns 受影响的行数
     */
    static async bulkCreate(payloads: BackupAndRecovery[]): Promise<number> {
        return (await baseCRUD.insertRows(this.TABLE_NAME, toDb(payloads))).rowsAffected;
    }

    /**
     * 更新指定备份和恢复数据
     * @param payload 备份和恢复数据对象
     * @returns 受影响的行数
     */
    static async updateOne(payload: BackupAndRecovery): Promise<number> {
        return (await baseCRUD.updateWhere(this.TABLE_NAME, payload, { id: payload.id })).rowsAffected;
    }

    /**
     * 根据条件删除记录
     * @param filter 删除条件
     * @returns 受影响的行数
     */
    static async deleteOne(filter: Record<string, any>): Promise<number> {
        return (await baseCRUD.deleteRow(
            this.TABLE_NAME,
            filter
        )).rowsAffected;
    }

    /**
     * 统计表中的记录数
     * @returns 记录总数
     */
    static async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}
