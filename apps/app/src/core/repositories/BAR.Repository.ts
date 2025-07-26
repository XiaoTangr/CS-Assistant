import { baseCRUD } from "@/core/database";
import { BackupAndRecovery } from "../models";

export default class BackupAndRecoveryRepository {
    private static TABLE_NAME = "BackupAndRecovery";

    /**
     * 查询所有备份和恢复数据
     * @returns 所有数据
     */
    static async queryAll(): Promise<BackupAndRecovery[]> {
        return (await baseCRUD.queryAll<BackupAndRecovery>(this.TABLE_NAME)) || [];
    }


    /**
     * 根据 ID 查询单条数据
     * @param id 备份或恢复记录的 ID
     * @returns 单条记录或 null
     */
    static async queryOneById(id: number): Promise<BackupAndRecovery | null> {
        const results = await baseCRUD.queryWhere<BackupAndRecovery>(
            this.TABLE_NAME,
            "id = $1",
            [id]
        );
        return results.length > 0 ? results[0] : null;
    }


    /**
     * 插入多条备份和恢复数据
     * @param data 备份和恢复数据数组
     * @returns 受影响的行数
     */
    static async insert(data: BackupAndRecovery[]): Promise<number> {
        return await baseCRUD.insertRows(this.TABLE_NAME, data);
    }

    /**
     * 更新指定备份和恢复数据
     * @param data 备份和恢复数据对象
     * @returns 受影响的行数
     */
    static async update(data: BackupAndRecovery): Promise<number> {
        return await baseCRUD.updateWhere(this.TABLE_NAME, data, { id: data.id });
    }
    /**
     * 根据 ID 删除记录
     * @param id 备份或恢复记录的 ID
     * @returns 受影响的行数
     */
    static async delete(id: number): Promise<number> {
        return await baseCRUD.deleteRow(this.TABLE_NAME, 'id', id);
    }
    /**
     * 获取表的总记录数
     * @returns 记录总数
     */
    static async count(): Promise<number> {
        return await baseCRUD.count(this.TABLE_NAME);
    }
}