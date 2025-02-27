import { DBConn } from "./DBConn";

class DBCUDRUtil {
    private static instance: DBCUDRUtil;

    private constructor() { } // 私有构造函数，确保单例模式

    /**
     * 获取单例实例
     */
    public static getInstance(): DBCUDRUtil {
        if (!DBCUDRUtil.instance) {
            DBCUDRUtil.instance = new DBCUDRUtil();
        }
        return DBCUDRUtil.instance;
    }

    /**
     * 通用查询：获取表中所有数据
     * @param tableName - 表名
     * @returns 返回一个包含所有行的数组，如果发生错误则返回 null
     */
    public async queryAll<T>(tableName: string): Promise<T[] | null> {
        // 校验表名，防止 SQL 注入
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('表名无效');
        }

        const sql = `SELECT * FROM ${tableName};`;
        const db = await new DBConn().init();

        try {
            const rows = await db.select(sql);
            return rows as T[];
        } catch (error) {
            console.error('查询所有数据时出错:', error);
            return null;
        } finally {
            await db.close();
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
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('表名无效');
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
            throw new Error('列名无效');
        }

        const sql = `SELECT * FROM ${tableName} WHERE ${columnName} = $1;`;
        const db = await new DBConn().init();

        try {
            const rows:any = await db.select(sql, [columnValue]);
            return rows.length > 0 ? (rows[0] as T) : null;
        } catch (error) {
            console.error('查询单行数据时出错:', error);
            return null;
        } finally {
            await db.close();
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
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('表名无效');
        }
        const db = await new DBConn().init();
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
        } catch (error) {
            console.error('插入数据时出错:', error);
            return 0;
        } finally {
            await db.close();
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
    ): Promise<boolean> {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('表名无效');
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
            throw new Error('列名无效');
        }

        const setClause = Object.keys(data)
            .map((key, index) => {
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                    throw new Error(`无效的字段名: ${key}`);
                }
                return `${key} = $${index + 1}`;
            })
            .join(', ');

        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${columnName} = $${Object.keys(data).length + 1};`;
        const db = await new DBConn().init();

        try {
            const params = [...Object.values(data), columnValue];
            const result = await db.execute(sql, params);
            return result.rowsAffected > 0;
        } catch (error) {
            console.error('更新数据时出错:', error);
            return false;
        } finally {
            await db.close();
        }
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
    ): Promise<boolean> {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
            throw new Error('表名无效');
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName)) {
            throw new Error('列名无效');
        }

        const sql = `DELETE FROM ${tableName} WHERE ${columnName} = $1;`;
        const db = await new DBConn().init();

        try {
            const result = await db.execute(sql, [columnValue]);
            return result.rowsAffected > 0;
        } catch (error) {
            console.error('删除数据时出错:', error);
            return false;
        } finally {
            await db.close();
        }
    }
}

// 导出单例对象
export const dbCUDRUtil = DBCUDRUtil.getInstance();