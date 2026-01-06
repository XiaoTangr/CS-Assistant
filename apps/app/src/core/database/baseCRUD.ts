import LogService from "../services/Log.service";
import { connecter } from "./";

interface SqlResult {
    rowsAffected: number;
    lastInsertId?: number;
    success: boolean;
    data?: any;
}

interface QueryOptions {
    where?: Record<string, any>;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    limit?: number;
    columns?: string[];
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

    private _validateTableName(tableName: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }
    }
    private _validateColumnName(columnName: string): void {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
            throw new Error(`Invalid column name: ${columnName}`);
        }
    }
    private _escapeValue(value: any): any {
        if (value === null || value === undefined) return null;
        if (value instanceof Date) return value.toISOString();
        return value;
    }


    private _buildSafeWhere(where: Record<string, any>, startIndex: number = 1): [string, any[]] {
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIndex = startIndex;
        for (const [key, value] of Object.entries(where)) {
            this._validateColumnName(key);
            if (Array.isArray(value)) {
                if (value.length === 0) { conditions.push('1=0'); continue; }
                const placeholders = value.map((_, i) => `$${paramIndex + i}`).join(', ');
                conditions.push(`"${key}" IN (${placeholders})`);
                params.push(...value.map(v => this._escapeValue(v)));
                paramIndex += value.length;
            } else if (value === null || value === undefined) {
                conditions.push(`"${key}" IS NULL`);
            } else if (typeof value === 'object') {
                for (const [op, opValue] of Object.entries(value)) {
                    const v = this._escapeValue(opValue);
                    if (op === '$gt') { conditions.push(`"${key}" > $${paramIndex}`); params.push(v); paramIndex++; }
                    else if (op === '$gte') { conditions.push(`"${key}" >= $${paramIndex}`); params.push(v); paramIndex++; }
                    else if (op === '$lt') { conditions.push(`"${key}" < $${paramIndex}`); params.push(v); paramIndex++; }
                    else if (op === '$lte') { conditions.push(`"${key}" <= $${paramIndex}`); params.push(v); paramIndex++; }
                    else if (op === '$like') { conditions.push(`"${key}" LIKE $${paramIndex}`); params.push(v); paramIndex++; }
                    else if (op === '$ne') { conditions.push(`"${key}" != $${paramIndex}`); params.push(v); paramIndex++; }
                }
            } else {
                conditions.push(`"${key}" = $${paramIndex}`);
                params.push(this._escapeValue(value));
                paramIndex++;
            }
        }
        return [conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '', params];
    }

    // 修改 _buildQuerySuffix 方法
    private _buildQuerySuffix(options: QueryOptions, paramStartIndex: number = 1): [string, any[]] {
        const clauses: string[] = [];
        const params: any[] = [];
        let paramIndex = paramStartIndex;
        if (options.orderBy) {
            this._validateColumnName(options.orderBy);
            const direction = options.orderDirection === 'DESC' ? 'DESC' : 'ASC';
            clauses.push(`ORDER BY "${options.orderBy}" ${direction}`);
        }
        if (options.limit !== undefined) {
            clauses.push(`LIMIT $${paramIndex}`);
            params.push(options.limit);
            paramIndex++;
        }
        return [clauses.join(' '), params];
    }

    /**
     * 执行SELECT查询
     */
    private async _select<T>(sql: string, params: any[] = []): Promise<T[]> {
        const db = await connecter.getConnection();

        try {
            LogService.log(`[DBBaseCRUD._select]`, `SQL: ${sql}`, `\nParams:`, params);
            const result = await db.select(sql, params);
            // 修复：使用类型断言确保返回值符合 T[]
            return Array.isArray(result) ? result : (result ? [result as T] : []);
        } catch (error: any) {
            LogService.error(`Query failed: ${error.message}`, { error, sql, params });
            throw error;
        }
    }

    /**
     * 执行写操作
     */
    private async _execute(sql: string, params: any[] = []): Promise<SqlResult> {
        const db = await connecter.getConnection();

        try {
            LogService.log(`[DBBaseCRUD._execute]`, `SQL: ${sql}`, `\nParams:`, params);
            const result = await db.execute(sql, params);

            return {
                rowsAffected: result.rowsAffected || 0,
                lastInsertId: result.lastInsertId,
                success: true,
                data: result
            };
        } catch (error: any) {
            LogService.error(`[DBBaseCRUD._execute]Execute failed: ${error.message}`, { error, sql, params });
            return {
                rowsAffected: 0,
                success: false,
                data: null
            };
        }
    }


    // ==================== 核心CRUD操作 ====================

    /**
     * 插入数据（支持单条和批量）
     * @param tableName 表名
     * @param data 数据
     * @returns 插入结果
     * @throws {Error} 如果数据为空或无效
     */
    public async insert<T extends Record<string, any>>(
        tableName: string,
        data: T | T[]
    ): Promise<SqlResult> {
        this._validateTableName(tableName);

        const dataArray = Array.isArray(data) ? data : [data];

        if (dataArray.length === 0) {
            return { rowsAffected: 0, success: true, data: null };
        }

        const columns = Object.keys(dataArray[0]).filter(Boolean);
        if (columns.length === 0) {
            return { rowsAffected: 0, success: true, data: null };
        }

        columns.forEach(col => this._validateColumnName(col));

        // 使用 $1, $2... 作为占位符
        let paramIndex = 1;
        const placeholders = columns.map((_, i) => `$${paramIndex + i}`).join(', ');
        paramIndex += columns.length;

        const columnList = columns.map(col => `"${col}"`).join(", ");
        const sql = `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`;

        // 单条插入
        if (dataArray.length === 1) {
            const values = columns.map(col => this._escapeValue(dataArray[0][col]));
            return await this._execute(sql, values);
        }

        // 批量插入（并发执行）
        const results = await Promise.all(
            dataArray.map(item => {
                const values = columns.map(col => this._escapeValue(item[col]));
                return this._execute(sql, values);
            })
        );
        const rowsAffected = results.reduce((sum, r) => sum + (r.rowsAffected || 0), 0);
        const lastInsertId = results.reduce((max, r) => r.lastInsertId && r.lastInsertId > (max || 0) ? r.lastInsertId : max, undefined as number | undefined);

        return {
            rowsAffected,
            lastInsertId,
            success: results.every(r => r.success),
            data: { insertedCount: rowsAffected }
        };
    }

    /**
     * 删除数据
     * @param tableName 表名
     * @param where 删除条件
     * @example delete('users', { id: 1 });
     * @example delete('users', { id: 1, name: 'John' });
     * @example delete('users', { id: [1, 2, 3] });
     */
    public async delete(
        tableName: string,
        where: Record<string, any>
    ): Promise<SqlResult> {
        this._validateTableName(tableName);

        if (!where || Object.keys(where).length === 0) {
            throw new Error('Delete operation requires WHERE condition for safety');
        }

        const [whereClause, params] = this._buildSafeWhere(where);
        const sql = `DELETE FROM "${tableName}" ${whereClause}`;

        return await this._execute(sql, params);
    }

    /**
     * 更新数据
     * @param tableName 表名
     * @param data 更新数据或更新配置对象
     * @param where 更新条件（当data为对象时必需）
     * @example update('users', { name: 'John' }, { id: 1 }); // 传统用法
     * @example update('users', { data: { name: 'John' }, where: { id: 1 } }); // 配置对象用法
     * @example update('users', [{ data: { name: 'John' }, where: { id: 1 } }, { data: { name: 'Jane' }, where: { id: 2 } }]); // 批量更新
     */
    public async update(
        tableName: string,
        data: Record<string, any> | { data: Record<string, any>, where: Record<string, any> } | Array<{ data: Record<string, any>, where: Record<string, any> }>,
        where?: Record<string, any>
    ): Promise<SqlResult> {
        this._validateTableName(tableName);

        // 批量更新模式
        if (Array.isArray(data)) {
            if (data.length === 0) {
                throw new Error('Update batch data cannot be empty');
            }

            for (const update of data) {
                if (!update.data || Object.keys(update.data).length === 0) {
                    throw new Error('Update data cannot be empty');
                }
                if (!update.where || Object.keys(update.where).length === 0) {
                    throw new Error('Update operation requires WHERE condition for safety');
                }
            }

            // 并发执行批量更新
            const results = await Promise.all(
                data.map(update => this.update(tableName, update.data, update.where))
            );
            const totalRowsAffected = results.reduce((sum, r) => sum + (r.rowsAffected || 0), 0);
            const lastInsertId = results.reduce((max, r) => r.lastInsertId && r.lastInsertId > (max || 0) ? r.lastInsertId : max, undefined as number | undefined);

            return {
                rowsAffected: totalRowsAffected,
                lastInsertId,
                success: results.every(r => r.success),
                data: { updatedCount: totalRowsAffected }
            };
        }

        // 配置对象模式
        if (data && typeof data === 'object' && 'data' in data && 'where' in data) {
            return this.update(tableName, data.data, data.where);
        }

        // 传统更新模式
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Update data cannot be empty');
        }
        if (!where || Object.keys(where).length === 0) {
            throw new Error('Update operation requires WHERE condition for safety');
        }

        const setClauses: string[] = [];
        const setParams: any[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(data)) {
            this._validateColumnName(key);
            setClauses.push(`"${key}" = $${paramIndex}`);
            setParams.push(this._escapeValue(value));
            paramIndex++;
        }

        const [whereClause, whereParams] = this._buildSafeWhere(where, paramIndex);
        const sql = `UPDATE "${tableName}" SET ${setClauses.join(', ')} ${whereClause}`;
        const params = [...setParams, ...whereParams];

        return await this._execute(sql, params);
    }

    /**
     * 查询数据
     * @param tableName 表名
     * @param options 查询选项
     * @example query('users', { columns: ['id', 'name'], where: { id: 1 } });
     * @example query('users', { columns: ['id', 'name'], where: { id: [1, 2, 3] } });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' } });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' }, orderBy: ['id DESC', 'name ASC'], limit: 10, offset: 0 });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' }, orderBy: ['id DESC', 'name ASC'], limit: 10, offset: 0, distinct: true });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' }, orderBy: ['id DESC', 'name ASC'], limit: 10, offset: 0, distinct: true });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' }, orderBy: ['id DESC', 'name ASC'], limit: 10, offset: 0, distinct: true });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' }, orderBy: ['id DESC', 'name ASC'], limit: 10, offset: 0, distinct: true });
     * @example query('users', { columns: ['id', 'name'], where: { id: 1, name: 'John' }, orderBy: ['id DESC', 'name ASC'], limit: 10, offset: 0, distinct: true });
     */
    public async query<T = any>(
        tableName: string,
        options: QueryOptions = {}
    ): Promise<T[]> {
        this._validateTableName(tableName);

        // 构建列选择
        const columnList = options.columns
            ? options.columns.map(col => {
                this._validateColumnName(col);
                return `"${col}"`;
            }).join(', ')
            : '*';

        let sql = `SELECT ${columnList} FROM "${tableName}"`;
        let params: any[] = [];

        // 构建 WHERE 条件
        if (options.where && Object.keys(options.where).length > 0) {
            const [whereClause, whereParams] = this._buildSafeWhere(options.where);
            sql += ` ${whereClause}`;
            params.push(...whereParams);
        }

        // 构建排序和分页
        const [suffixClause, suffixParams] = this._buildQuerySuffix(options, params.length + 1);
        if (suffixClause) {
            sql += ` ${suffixClause}`;
            params.push(...suffixParams);
        }

        return await this._select<T>(sql, params);
    }

    /**
     * 查询单条记录
     * @param tableName 表名
     * @param where 查询条件
     * @example queryOne('users', { id: 1 });
     * @example queryOne('users', { id: [1, 2, 3] });
     * @example queryOne('users', { id: 1, name: 'John' });
     * @returns 返回匹配的记录或 null
     */
    public async queryOne<T = any>(
        tableName: string,
        where: Record<string, any>
    ): Promise<T | null> {
        const results = await this.query<T>(tableName, {
            where,
            limit: 1
        });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * 获取记录数量
     * @param tableName 表名
     * @param where 查询条件
     * @example count('users);
     * @example count('users', { id: 1 });
     */
    public async count(
        tableName: string,
        where?: Record<string, any>
    ): Promise<number> {
        this._validateTableName(tableName);

        let sql = `SELECT COUNT(*) as count FROM "${tableName}"`;
        let params: any[] = [];

        if (where && Object.keys(where).length > 0) {
            const [whereClause, whereParams] = this._buildSafeWhere(where);
            sql += ` ${whereClause}`;
            params.push(...whereParams);
        }

        const result = await this._select<{ count: number }>(sql, params);
        return result[0]?.count || 0;
    }
    /**
     * 分页查询
     * @param tableName 表名
     * @param page 当前页码
     * @param pageSize 每页数量
     * @param options 查询选项
     * @returns 返回分页数据
     */
    public async paginate<T = any>(
        tableName: string,
        page: number = 1,
        pageSize: number = 10,
        options: Omit<QueryOptions, 'limit'> = {}
    ): Promise<{ data: T[]; total: number; page: number; pageSize: number; totalPages: number }> {
        const data = await this.query<T>(tableName, {
            ...options,
            limit: pageSize,
            // offset参数在_querySuffix中可扩展
        });
        const total = await this.count(tableName, options.where);
        const totalPages = Math.ceil(total / pageSize);
        return {
            data,
            total,
            page,
            pageSize,
            totalPages
        };
    }
    // ...existing code...

    /**
     * SQLite 特定功能 - 获取表结构
     * @param tableName 表名
     */
    public async getTableSchema(tableName: string): Promise<any[]> {
        this._validateTableName(tableName);
        const sql = `PRAGMA table_info("${tableName}")`;
        return await this._select(sql);
    }
}

export default DBBaseCRUD.getInstance();
