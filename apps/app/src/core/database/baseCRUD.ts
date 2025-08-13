import { LogServices } from "../services";
import { connecter } from "./";

interface sqlResult {
    // 受影响的行数
    rowsAffected: number;
    // 最后插入的ID
    lastInsertId?: number;
    // 执行结果
    success: boolean;
    // 返回的数据
    data?: any;
}

class DBBaseCRUD {
    private static instance: DBBaseCRUD;

    private constructor() { }

    public static getInstance(): DBBaseCRUD {
        if (!DBBaseCRUD.instance) {
            DBBaseCRUD.instance = new DBBaseCRUD();
        }
        return DBBaseCRUD.instance;
    }

    /**
     * 验证表名
     * @param tableName 表名
     */
    private _validateTableName(tableName: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }
    }

    /**
     * 验证列名
     * @param columnName 列名
     */
    private _validateColumnName(columnName: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
            throw new Error(`Invalid column name: ${columnName}`);
        }
    }

    /**
     * 构建安全的SQL片段
     * @param values 值数组
     * @param startIndex 参数起始索引
     * @returns [sql片段, params]
     */
    private _buildSafeValues(values: any[], startIndex: number = 1): [string, any[]] {
        const placeholders: string[] = [];
        const params: any[] = [];

        values.forEach((value, i) => {
            placeholders.push(`$${startIndex + i}`);
            params.push(value);
        });

        return [placeholders.join(', '), params];
    }

    /**
     * 构建安全的WHERE条件
     * @param where 条件对象
     * @param startIndex 参数起始索引
     * @returns [whereClause, params]
     */
    private _buildSafeWhere(where: Record<string, any>, startIndex: number = 1): [string, any[]] {
        const conditions: string[] = [];
        const params: any[] = [];

        for (const [key, value] of Object.entries(where)) {
            this._validateColumnName(key);
            if (Array.isArray(value)) {
                // 处理IN条件
                const [placeholders, inParams] = this._buildSafeValues(value, startIndex);
                conditions.push(`"${key}" IN (${placeholders})`);
                params.push(...inParams);
                startIndex += value.length;
            } else if (value === null || value === undefined) {
                conditions.push(`"${key}" IS NULL`);
            } else {
                conditions.push(`"${key}" = $${startIndex}`);
                params.push(value);
                startIndex++;
            }
        }

        return [conditions.join(' AND '), params];
    }

    /**
     * 封装 SELECT 查询
     * @param sql sql语句
     * @param params sql占位符对应值
     * @returns
     */
    private async _select<T>(sql: string, params: any[] = []): Promise<T[]> {
        const db = await connecter.getConnection();
        LogServices.log(`[DBBaseCRUD._select]\n\r`,
            `Executing query SQL:\n\r`,
            `${sql}\n\r`,
            `params:\n\r`,
            params);
        try {
            return await db.select(sql, params);
        } catch (error: any) {
            const errorMessage = `Query failed: ${error.message || 'Unknown error'}, SQL: ${sql}`;
            LogServices.error(errorMessage, {
                error,
                sql,
                params,
                timestamp: new Date().toISOString(),
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 执行sql
     * @param sql sql语句
     * @param params sql占位符对应值
     * @returns 执行结果
     */
    private async _execute(sql: string, params: any[] = []): Promise<sqlResult> {
        const db = await connecter.getConnection();
        LogServices.log(`[DBBaseCRUD._execute]\n\r`,
            `Executing execute SQL:\n\r`,
            `${sql}\n\r`,
            `params:\n\r`,
            params);
        try {
            const result = await db.execute(sql, params);
            return {
                rowsAffected: result.rowsAffected,
                lastInsertId: result.lastInsertId,
                success: true,
                data: result
            };
        } catch (error: any) {
            const errorMessage = `Execute failed: ${error.message || 'Unknown error'}, SQL: ${sql}`;
            LogServices.error(errorMessage, {
                error,
                sql,
                params,
                timestamp: new Date().toISOString(),
                stack: error.stack
            });
            return {
                rowsAffected: 0,
                success: false,
                data: null
            };
        }
    }

    /**
     * 插入多条记录
     * @param tableName 表名
     * @param data 数据数组
     * @returns 执行结果
     */
    public async insertRows<T extends Record<string, any>>(
        tableName: string,
        data: T[]
    ): Promise<sqlResult> {
        this._validateTableName(tableName);

        if (data.length === 0) {
            return {
                rowsAffected: 0,
                success: true,
                data: null
            };
        }

        const columns = Object.keys(data[0]).filter(Boolean);
        if (columns.length === 0) {
            return {
                rowsAffected: 0,
                success: true,
                data: null
            };
        }

        // 验证所有列名
        columns.forEach(col => this._validateColumnName(col));

        const [placeholders] = this._buildSafeValues(columns, 1);
        const columnList = columns.map(col => `"${col}"`).join(", ");
        const sql = `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`;

        let rowsAffected = 0;
        const lastInsertIds: number[] = [];

        try {
            await this._execute("BEGIN TRANSACTION");

            for (const item of data) {
                const values = columns.map(col => item[col] ?? null);
                const result = await this._execute(sql, values);
                rowsAffected += result.rowsAffected ?? 0;
                if (result.lastInsertId) {
                    lastInsertIds.push(result.lastInsertId);
                }
            }

            await this._execute("COMMIT");
            return {
                rowsAffected,
                lastInsertId: lastInsertIds.length > 0 ? Math.max(...lastInsertIds) : undefined,
                success: true,
                data: { insertedCount: rowsAffected, lastInsertIds }
            };
        } catch (e: any) {
            await this._execute("ROLLBACK");
            LogServices.error(`[SQLite insertRows] 失败`, {
                error: e.message,
                sql,
                lastParams: data[data.length - 1]
            });
            return {
                rowsAffected: 0,
                success: false,
                data: null
            };
        }
    }

    /**
         * 使用 WHERE 条件查询数据
         * @param tableName 表名
         * @param where WHERE 条件对象
         * @returns 查询结果数组
         */
    public async queryWhere<T>(
        tableName: string,
        where: Record<string, any>
    ): Promise<T[]> {
        this._validateTableName(tableName);

        if (typeof where !== 'object' || where === null || Object.keys(where).length === 0) {
            throw new Error(`Invalid WHERE clause provided for query`);
        }

        const [whereClause, params] = this._buildSafeWhere(where);
        const sql = `SELECT * FROM "${tableName}" WHERE ${whereClause}`;
        return await this._select<T>(sql, params);
    }

    /**
     * 查询所有数据
     * @param tableName 表名
     * @returns 查询结果数组
     */
    public async queryAll<T>(tableName: string): Promise<T[]> {
        this._validateTableName(tableName);
        const sql = `SELECT * FROM "${tableName}"`;
        return await this._select<T>(sql) ?? [];
    }

    /**
     * 条件更新
     * @param tableName 表名
     * @param data 更新的数据对象
     * @param where WHERE 条件对象
     * @returns 执行结果
     */
    public async updateWhere<T extends Record<string, any>>(
        tableName: string,
        data: T,
        where: Record<string, any>
    ): Promise<sqlResult> {
        this._validateTableName(tableName);

        if (typeof data !== 'object' || data === null) {
            return {
                rowsAffected: 0,
                success: false,
                data: null
            };
        }

        if (Object.keys(where).length === 0) {
            return {
                rowsAffected: 0,
                success: false,
                data: null
            };
        }

        // 构建SET子句
        const setClauses: string[] = [];
        const setParams: any[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(data)) {
            this._validateColumnName(key);
            setClauses.push(`"${key}" = $${paramIndex}`);
            setParams.push(value);
            paramIndex++;
        }

        // 构建WHERE子句
        const [whereClause, whereParams] = this._buildSafeWhere(where, paramIndex);

        const sql = `UPDATE "${tableName}" SET ${setClauses.join(', ')} WHERE ${whereClause}`;
        const params = [...setParams, ...whereParams];

        return await this._execute(sql, params);
    }

    /**
     * 根据字段删除
     * @param tableName 表名
     * @param where 删除条件对象
     * @returns 执行结果
     */
    public async deleteRow(
        tableName: string,
        where: Record<string, any>
    ): Promise<sqlResult> {
        this._validateTableName(tableName);

        if (typeof where !== 'object' || where === null || Object.keys(where).length === 0) {
            return {
                rowsAffected: 0,
                success: false,
                data: null
            };
        }

        const [whereClause, params] = this._buildSafeWhere(where);
        const sql = `DELETE FROM "${tableName}" WHERE ${whereClause}`;
        return await this._execute(sql, params);
    }

    /**
     * 获取总数
     * @param tableName 表名
     * @returns 总记录数
     */
    public async count(tableName: string): Promise<number> {
        this._validateTableName(tableName);
        const sql = `SELECT COUNT(*) as count FROM "${tableName}"`;
        const result = await this._select<{ count: number }>(sql);
        return result[0]?.count || 0;
    }

    /**
     * 执行原始 SQL
     * @param sql 原始 SQL 语句
     * @param params SQL 占位符参数
     * @returns 执行结果
     */
    public async executeRaw(sql: string, ...params: any[]): Promise<any> {
        // 安全验证 - 防止直接执行危险操作
        const lowerSql = sql.toLowerCase().trim();
        if (lowerSql.startsWith('drop ') ||
            lowerSql.startsWith('alter ') ||
            lowerSql.startsWith('grant ')) {
            throw new Error('Potentially dangerous SQL operation blocked');
        }

        let returnData: sqlResult = {
            rowsAffected: 0,
            lastInsertId: undefined,
            success: false,
            data: null
        };


        if (lowerSql.startsWith('select')) {
            let d = await this._select(sql, params);
            returnData = {
                rowsAffected: 0,
                success: true,
                data: d
            };
        } else {
            let d = await this._execute(sql, params)
            returnData = {
                rowsAffected: d.rowsAffected,
                lastInsertId: d.lastInsertId,
                success: d.success,
                data: d.data
            };
        }

        return returnData;
    }

    /**
         * 基于游标的分页查询
         * @param tableName 表名
         * @param cursor 游标值
         * @param pageSize 每页数量
         * @param orderBy 排序字段
         * @param orderDirection 排序方向
         */
    public async queryWithCursor<T>(
        tableName: string,
        cursor: number | string | null,
        pageSize: number = 10,
        orderBy: string = 'id',
        orderDirection: 'ASC' | 'DESC' = 'ASC'
    ): Promise<T[]> {
        this._validateTableName(tableName);
        this._validateColumnName(orderBy);

        let sql = `SELECT * FROM "${tableName}"`;
        const params: any[] = [];

        if (cursor !== null) {
            sql += ` WHERE "${orderBy}" ${orderDirection === 'ASC' ? '>' : '<'} $1`;
            params.push(cursor);
        }

        sql += ` ORDER BY "${orderBy}" ${orderDirection} LIMIT $${params.length + 1}`;
        params.push(pageSize);

        return await this._select<T>(sql, params) ?? [];
    }

    /**
 * 基于偏移量的分页查询
 * @param tableName 表名
 * @param page 页码（从 1 开始）
 * @param pageSize 每页数量
 * @param orderBy 排序字段
 * @param orderDirection 排序方向
 */
    public async queryWithOffset<T>(
        tableName: string,
        page: number,
        pageSize: number = 10,
        orderBy: string = 'id',
        orderDirection: 'ASC' | 'DESC' = 'ASC'
    ): Promise<T[]> {
        this._validateTableName(tableName);
        this._validateColumnName(orderBy);

        const offset = (page - 1) * pageSize;
        const sql = `
            SELECT * FROM "${tableName}"
            ORDER BY "${orderBy}" ${orderDirection}
            LIMIT $1 OFFSET $2
        `;

        return await this._select<T>(sql, [pageSize, offset]) ?? [];
    }
}

export default DBBaseCRUD.getInstance();
