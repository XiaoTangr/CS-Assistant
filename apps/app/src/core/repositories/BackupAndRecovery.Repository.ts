import { baseCRUD } from "@/core/database";
import { BackupAndRecovery } from "../models";
import { fromDb } from "../utils";

export default class BackupAndRecoveryRepository {

    private static TABLE_NAME = "t_BackupAndRecovery";

    /**
     * 查询所有备份和恢复数据
     * @returns 所有数据
     */
    static async queryAll(): Promise<BackupAndRecovery[]> {
        return fromDb<BackupAndRecovery[]>((await baseCRUD.queryAll<BackupAndRecovery>(this.TABLE_NAME)) ?? []);
    }


    /**
     * 分页查询备份和恢复数据
     * @param pageCurso 游标
     * @param pageSize 每页数量
     * @returns 分页数据
     */
    static async queryPageData(currentPage: number, pageSize: number): Promise<BackupAndRecovery[]> {
        return fromDb<BackupAndRecovery[]>((await baseCRUD.queryWithOffset<BackupAndRecovery>(this.TABLE_NAME, currentPage, pageSize, "c_id")) ?? []);
    }

    /**
     * 根据 ID 查询单条数据
     * @param id 备份或恢复记录的 ID
     * @returns 单条记录或 null
     */
    static async queryOneById(id: number): Promise<BackupAndRecovery | null> {
        const results = await baseCRUD.queryWhere<BackupAndRecovery>(
            this.TABLE_NAME,
            { c_id: id },
        );
        return results.length > 0 ? results[0] : null;
    }


    /**
     * 插入多条备份和恢复数据
     * @param data 备份和恢复数据数组
     * @returns 受影响的行数
     */
    static async insert(data: BackupAndRecovery[]): Promise<number> {
        return (await baseCRUD.insertRows(this.TABLE_NAME, data)).rowsAffected;
    }

    /**
     * 更新指定备份和恢复数据
     * @param data 备份和恢复数据对象
     * @returns 受影响的行数
     */
    static async update(data: BackupAndRecovery): Promise<number> {
        return (await baseCRUD.updateWhere(this.TABLE_NAME, data, { id: data.id })).rowsAffected;
    }
    /**
     * 根据 ID 删除记录
     * @param id 备份或恢复记录的 ID
     * @returns 受影响的行数
     */
    static async delete(id: number): Promise<number> {
        return (await baseCRUD.deleteRow(
            this.TABLE_NAME,
            { 'c_id': id }
        )).rowsAffected;
    }
    /**
     * 获取表的总记录数
     * @returns 记录总数
     */
    static async getDataCount(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}
