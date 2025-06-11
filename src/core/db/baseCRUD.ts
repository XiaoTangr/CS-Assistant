import connecter from "./connector";
import Database from "@tauri-apps/plugin-sql";

class DBBaseCRUD {
    private static instance: DBBaseCRUD;

    private constructor() { }

    public static getInstance(): DBBaseCRUD {
        if (!DBBaseCRUD.instance) {
            DBBaseCRUD.instance = new DBBaseCRUD();
        }
        return DBBaseCRUD.instance;
    }

    private log(message: string) {
        console.log(`[DBBaseCRUD] ${message}`);
    }

    private validateTableName(tableName: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }
    }

    private validateColumnName(columnName: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
            throw new Error(`Invalid column name: ${columnName}`);
        }
    }

    // 封装 SELECT 查询
    private async _select<T>(sql: string, params: any[] = []): Promise<T[]> {
        const db = await connecter.getConnection();
        this.log(`Executing query: ${sql}`);
        try {
            return await db.select(sql, params);
        } catch (error: any) {
            throw new Error(`Query failed: ${error.message}, SQL: ${sql}`);
        }
    }

    // 封装 EXECUTE 操作
    private async _execute(sql: string, params: any[] = []): Promise<number> {
        const db = await connecter.getConnection();
        this.log(`Executing execute: ${sql}`);
        try {
            const result = await db.execute(sql, params);
            return result.rowsAffected;
        } catch (error: any) {
            throw new Error(`Execute failed: ${error.message}, SQL: ${sql}`);
        }
    }
    // 使用 queryAll 并加上 WHERE 条件（修改 baseCRUD）
    public async queryWhere<T>(
        tableName: string,
        whereClause: string,
        params: any[] = []
    ): Promise<T[]> {
        this.validateTableName(tableName);
        const sql = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
        return await this._select<T>(sql, params);
    }
    // 查询所有数据
    public async queryAll<T>(tableName: string): Promise<T[] | null> {
        this.validateTableName(tableName);
        const sql = `SELECT * FROM ${tableName};`;
        return await this._select<T>(sql);
    }

    // 分页查询
    public async queryPage<T>(
        tableName: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<{ data: T[]; total: number }> {
        this.validateTableName(tableName);
        const offset = (page - 1) * pageSize;
        const sql = `SELECT * FROM ${tableName} LIMIT $1 OFFSET $2`;
        const countSql = `SELECT COUNT(*) as count FROM ${tableName}`;

        try {
            const data = await this._select<T>(sql, [pageSize, offset]);
            const [{ count }] = await this._select<{ count: number }>(countSql);
            return { data, total: count };
        } catch (error: any) {
            throw new Error(`Query page failed: ${error.message}`);
        }
    }

    // 插入多条记录
    public async insertRows<T extends Record<string, any>>(
        tableName: string,
        data: T[]
    ): Promise<number> {
        this.validateTableName(tableName);
        if (data.length === 0) return 0;

        const columns = Object.keys(data[0]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const columnList = columns.join(", ");
        const sql = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders})`;

        let rowsAffected = 0;
        for (const item of data) {
            const values = columns.map((col) => item[col]);
            rowsAffected += await this._execute(sql, values);
        }

        return rowsAffected;
    }

    // 条件更新
    public async updateWhere<T extends Record<string, any>>(
        tableName: string,
        data: T,
        where: Record<string, any>
    ): Promise<number> {
        this.validateTableName(tableName);

        const setClause = Object.keys(data)
            .map((key, index) => {
                this.validateColumnName(key);
                return `${key} = $${index + 1}`;
            })
            .join(", ");

        const whereClauses = Object.keys(where).map(
            (key, i) => `${key} = $${Object.keys(data).length + i + 1}`
        );

        const params = [...Object.values(data), ...Object.values(where)];
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClauses.join(" AND ")}`;

        return await this._execute(sql, params);
    }

    // 根据字段删除
    public async deleteRow(
        tableName: string,
        columnName: string,
        columnValue: string
    ): Promise<number> {
        this.validateTableName(tableName);
        this.validateColumnName(columnName);
        const sql = `DELETE FROM ${tableName} WHERE ${columnName} = $1`;
        return await this._execute(sql, [columnValue]);
    }

    // 获取总数
    public async count(tableName: string): Promise<number> {
        this.validateTableName(tableName);
        const sql = `SELECT COUNT(*) as count FROM ${tableName}`;
        const result = await this._select<{ count: number }>(sql);
        return result[0]?.count || 0;
    }

    // 事务支持
    public async transaction<T>(callback: (db: Database) => Promise<T>): Promise<T> {
        const db = await connecter.getConnection();
        try {
            await db.execute("BEGIN TRANSACTION");
            const result = await callback(db);
            await db.execute("COMMIT");
            return result;
        } catch (error: any) {
            await db.execute("ROLLBACK");
            throw new Error(`Transaction failed: ${error.message}`);
        }
    }

    public async executeRaw(sql: string): Promise<number> {
        return await this._execute(sql);
    }
}

export default DBBaseCRUD.getInstance();