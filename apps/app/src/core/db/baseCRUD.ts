import connecter from "./connector";

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

    /**
     * 执行sql
     * @param sql sql语句
     * @param params sql占位符对应值
     * @returns 
     */
    private async _execute(sql: string, params: any[] = []): Promise<number> {
        const db = await connecter.getConnection();
        this.log(`Executing execute: ${sql}`);
        try {
            const result = await db.execute(sql, params);
            return result.rowsAffected;
        } catch (error: any) {
            const errorMessage = `Execute failed: ${error.message || 'Unknown error'}, SQL: ${sql}`;
            console.error(errorMessage, {
                error,
                sql,
                params,
                timestamp: new Date().toISOString(),
                stack: error.stack
            });
            throw error; // 仅抛出原始错误，不包装
        }
    }

    /**
     * 插入多条记录 (SQLite 版本 - 数组参数兼容版)
     * @param tableName 表名
     * @param data 数据数组
     * @returns 受影响行数
     */
    public async insertRows<T extends Record<string, any>>(
        tableName: string,
        data: T[]
    ): Promise<number> {
        this.validateTableName(tableName);

        if (data.length === 0) return 0;

        const columns = Object.keys(data[0]).filter(Boolean);
        if (columns.length === 0) return 0;

        // SQLite 占位符格式 (使用数组参数时可以用 ? 或 $n)
        const placeholders = columns.map((_) => `?`).join(", ");
        const columnList = columns.map(col => `"${col}"`).join(", ");
        const sql = `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`;

        let rowsAffected = 0;

        try {
            // 使用事务提升批量插入性能
            await this._execute("BEGIN TRANSACTION");

            for (const item of data) {
                // 将对象值按列顺序转换为数组
                const values = columns.map(col => item[col] ?? null);
                rowsAffected += await this._execute(sql, values); // 传入数组
            }

            await this._execute("COMMIT");
        } catch (e: any) {
            await this._execute("ROLLBACK");
            console.error(`[SQLite insertRows] 失败`, {
                error: e.message,
                sql,
                lastParams: data[data.length - 1]
            });
            throw e;
        }

        return rowsAffected;
    }



    /**
     * 封装 SELECT 查询
     * @param sql sql语句
     * @param params sql占位符对应值
     * @returns 
     */
    private async _select<T>(sql: string, params: any[] = []): Promise<T[]> {
        const db = await connecter.getConnection();
        this.log(`Executing query: ${sql}`);
        try {
            return await db.select(sql, params);
        } catch (error: any) {
            const errorMessage = `Query failed: ${error.message || 'Unknown error'}, SQL: ${sql}`;
            console.error(errorMessage, {
                error,
                sql,
                params,
                timestamp: new Date().toISOString(),
                stack: error.stack
            });
            throw error; // 保留原始错误对象
        }
    }


    /**
     * 使用 WHERE 条件查询数据
     * @param tableName 表名
     * @param whereClause WHERE 条件（如 "id = $1"）
     * @param params 参数数组（如 [1]）
     * @returns 查询结果数组
     */
    public async queryWhere<T>(
        tableName: string,
        whereClause: string,
        params: any[] = []
    ): Promise<T[]> {
        this.validateTableName(tableName);
        const sql = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
        return await this._select<T>(sql, params);
    }

    /**
     * 查询所有数据
     * @param tableName 表名
     * @returns 查询结果数组
     */
    public async queryAll<T>(tableName: string): Promise<T[] | null> {
        this.validateTableName(tableName);
        const sql = `SELECT * FROM ${tableName};`;
        return await this._select<T>(sql);
    }


    /**
     * 条件更新
     * @param tableName 表名
     * @param data 更新的数据对象，键为字段名，值为字段值
     * @param where WHERE 条件对象，格式为 { column: value }
     * @returns 受影响行数
     */
    public async updateWhere<T extends Record<string, any>>(
        tableName: string,
        data: T,
        where: Record<string, any>
    ): Promise<number> {
        this.validateTableName(tableName);

        if (typeof data !== 'object' || data === null) {
            throw new TypeError(`Invalid data provided for update`);
        }

        if (Object.keys(where).length === 0) {
            throw new Error(`WHERE clause is required for update operation`);
        }


        const setClauses = Object.keys(data).map((col, i) => `\`${col}\` = $${i + 1}`).join(', ');
        const whereKey = Object.keys(where)[0];
        const whereValue = Object.values(where)[0];

        const sql = `UPDATE ${tableName} SET ${setClauses} WHERE ${whereKey} = $${Object.keys(data).length + 1} `;
        const params = [...Object.values(data), whereValue];

        return await this._execute(sql, params);
    }

    /**
     * 根据字段删除
     * @param tableName 表名
     * @param columnName 删除条件字段名
     * @param columnValue 删除条件字段值
     * @returns 受影响行数
     */
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

    /**
     * 获取总数
     * @param tableName 表名
     * @returns 总记录数
     */
    public async count(tableName: string): Promise<number> {
        this.validateTableName(tableName);
        const sql = `SELECT COUNT(*) as count FROM ${tableName} `;
        const result = await this._select<{ count: number }>(sql);
        return result[0]?.count || 0;
    }

    /**
     * 执行原始 SQL 查询
     * @param sql 原始 SQL 语句
     * @param params SQL 占位符参数
     * @returns 受影响行数
     */
    public async executeRaw(sql: string, ...params: any[]): Promise<number> {
        return await this._execute(sql, params);
    }
}

export default DBBaseCRUD.getInstance();