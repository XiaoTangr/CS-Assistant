import { dbConnUtil } from "./DBConnUtil";

class DBCRUDUtil {
    private static instance: DBCRUDUtil;

    private constructor() { } // 私有构造函数，确保单例模式

    /**
     * 获取单例实例
     */
    public static getInstance(): DBCRUDUtil {
        if (!DBCRUDUtil.instance) {
            DBCRUDUtil.instance = new DBCRUDUtil();
        }
        return DBCRUDUtil.instance;
    }

    /**
     * 通用查询：获取表中所有数据
     * @param tableName - 表名
     * @returns 返回一个包含所有行的数组，如果发生错误则返回 null
     */
    public async queryAll<T>(tableName: string): Promise<T[] | null> {
        // // 校验表名，防止 SQL 注入
        // if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        //     throw new Error('表名无效');
        // }

        const sql = `SELECT * FROM ${tableName};`;
        const db = await dbConnUtil.getConnection()

        try {
            const rows = await db.select(sql);
            return rows as T[];
        } catch (error: any) {
            throw new Error(error)
        }
    }

    /**
     * 通用查询：根据列名和列值查询单行数据
     * @param tableName - 表名
     * @param columnName - 列名
     * @param columnValue - 列值
     * @returns 返回查询到的单行数据，如果未找到或发生错误则返回 null
     */
    public async queryOne<T>(
        tableName: string,
        columnName: string,
        columnValue: string
    ): Promise<T | null> {
        // if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        //     throw new Error('表名无效');
        // }
        // if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
        //     throw new Error('列名无效');
        // }

        const sql = `SELECT * FROM ${tableName} WHERE ${columnName} = $1;`;
        const db = await dbConnUtil.getConnection()

        try {
            const rows: any = await db.select(sql, [columnValue]);
            return rows.length > 0 ? (rows[0] as T) : null;
        } catch (error: any) {
            throw new Error(error)
        }
    }

    /**
     * 通用插入：向表中插入多行数据
     * @param tableName - 表名
     * @param data - 要插入的数据数组
     * @returns 返回插入的行数
     */
    public async insertRows<T extends Record<string, any>>(
        tableName: string,
        data: T[]
    ): Promise<number> {
        // if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        //     throw new Error('表名无效');
        // }
        const db = await dbConnUtil.getConnection()
        let rowsAffected = 0;
        try {
            const columns = Object.keys(data[0]);
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            const columnList = columns.join(', ');
            const sql = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders})`;

            const promises = data.map((item) => {
                const values = columns.map((column) => item[column]);
                return db.execute(sql, values);
            });

            const results = await Promise.all(promises);
            rowsAffected = results.reduce((total, res) => total + res.rowsAffected, 0);
            return rowsAffected;
        } catch (error: any) {
            throw new Error(error)
        }
    }

    /**
     * 通用更新：更新表中的数据
     * @param tableName - 表名
     * @param data - 要更新的数据对象
     * @param columnName - 条件列名
     * @param columnValue - 条件列值
     * @returns 返回布尔值，表示是否成功更新
     */
    public async updateRow<T extends Record<string, any>>(
        tableName: string,
        data: T,
        columnName: string,
        columnValue: string
    ): Promise<number> {
        // if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        //     throw new Error('表名无效');
        // }
        // if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
        //     throw new Error('列名无效');
        // }

        const setClause = Object.keys(data)
            .map((key, index) => {
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                    throw new Error(`无效的字段名: ${key}`);
                }
                return `${key} = $${index + 1}`;
            })
            .join(', ');

        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${columnName} = $${Object.keys(data).length + 1};`;
        const db = await dbConnUtil.getConnection()

        try {
            const params = [...Object.values(data), columnValue];
            const result = await db.execute(sql, params);
            return result.rowsAffected;
        } catch (error: any) {
            throw new Error(error)
        }
    }


    /**
     * 通用更新
     * @param tableName 指定表
     * @param data 对应表的数据对象
     * @param columnName 主键列名
     * @returns 受影响的数据行数
     */
    public async updateRows<T extends Record<string, any>>(
        tableName: string,
        data: T[],
        columnName: string,
    ): Promise<number> {
        let affectedRows = 0;
        for (const row of data) {
            const columnValue = row[columnName];
            const result = await this.updateRow(tableName, row, columnName, columnValue);
            if (result) {
                affectedRows++;
            }
        }
        return affectedRows;
    }
    /**
     * 通用删除：根据列名和列值删除数据
     * @param tableName - 表名
     * @param columnName - 条件列名
     * @param columnValue - 条件列值
     * @returns 返回布尔值，表示是否成功删除
     */
    public async deleteRow(
        tableName: string,
        columnName: string,
        columnValue: string
    ): Promise<number> {
        const sql = `DELETE FROM ${tableName} WHERE ${columnName} = $1;`;
        console.log(sql)
        const bv = [columnValue as string];
        console.log(bv)
        const db = await dbConnUtil.getConnection();
        try {
            const result = await db.execute(sql, bv);
            return result.rowsAffected;
        } catch (error: any) {
            throw new Error(error);
        }
    }
    /**
     * **query**
     *
     * Passes in a SELECT query to the database for execution.
     *
     * @example
     * ```ts
     * // for sqlite & postgres
     * const result = await db.select(
     *    "SELECT * from todos WHERE id = $1", [ id ]
     * );
     *
     * // for mysql
     * const result = await db.select(
     *    "SELECT * from todos WHERE id = ?", [ id ]
     * );
     * ```
     */
    public async querySQL<T>(query: string, bindvalues: unknown[]): Promise<T> {
        const db = await dbConnUtil.getConnection();
        return await db.select(query, bindvalues)
    }
    /**
     * **execute**
     *
     * Passes a SQL expression to the database for execution.
     *
     * @example
     * ```ts
     * // for sqlite & postgres
     * // INSERT example
     * const result = await db.execute(
     *    "INSERT into todos (id, title, status) VALUES ($1, $2, $3)",
     *    [ todos.id, todos.title, todos.status ]
     * );
     * // UPDATE example
     * const result = await db.execute(
     *    "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
     *    [ todos.title, todos.status, todos.id ]
     * );
     *
     * // for mysql
     * // INSERT example
     * const result = await db.execute(
     *    "INSERT into todos (id, title, status) VALUES (?, ?, ?)",
     *    [ todos.id, todos.title, todos.status ]
     * );
     * // UPDATE example
     * const result = await db.execute(
     *    "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
     *    [ todos.title, todos.status, todos.id ]
     * );
     * ```
     */
    public async executeSQL(query: string, bindvalues?: unknown[]): Promise<number> {
        const db = await dbConnUtil.getConnection();
        return (await db.execute(query, bindvalues)).rowsAffected;
    }
}

// 导出单例对象
export const dbCRUDUtil = DBCRUDUtil.getInstance(); 