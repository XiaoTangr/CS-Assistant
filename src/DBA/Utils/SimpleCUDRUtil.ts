import { DBConn } from "./DBConn"

/**
 * Simple query to get all rows from a table.
 * @param TableName - The name of the table to query.
 * @returns A promise that resolves to an array of rows, or null if an error occurs.
 */
export const simpleQueryAll = async <T>(TableName: string): Promise<T[] | null> => {
    const sql = `select * from ${TableName};`
    const db = await new DBConn().init();
    let results: Array<T> = [];
    db.select(sql).then((rows: any) => {
        rows.forEach((row: any) => {
            results.push(row as T)
        })
    }).catch((error) => {
        throw error;
    })
    return results;
}
/**
 * Simple query to get one row from a table by column name and value.
 * @param TableName the name of the table to query
 * @param ColumnName the name of the column to query
 * @param ColumnValue the value of the column to query
 * @returns a promise that resolves to the row, or null if no row is found or an error occurs.
 */
export const simpleQueryOneByColumnName = async <T>(TableName: string, ColumnName: string, ColumnValue: string): Promise<T | null> => {
    const sql = `select * from ${TableName} where ${ColumnName} = ${ColumnValue};`
    const db = await new DBConn().init();
    try {
        return (await db.select(sql) as any).length > 0 ? (await db.select(sql) as any)[0] as T : null;
    } catch (e) {
        throw e;
    }
}

/**
 * Simple delete to delete one row from a table by column name and value.
 * @param TableName the name of the table to delete
 * @param ColumnName the name of the column to delete
 * @param ColumnValue the value of the column to find the row to delete
 * @returns a promise that resolves to true if the row was deleted, or false if no row was found or an error occurs.
 */
export const simpleDeleteByColumnName = async (TableName: string, ColumnName: string, ColumnValue: string): Promise<boolean> => {

    const querysql = `select * from ${TableName} where ${ColumnName} = "${ColumnValue}";`
    const delsql = `delete from ${TableName} where ${ColumnName} = "${ColumnValue}";`
    const db = await new DBConn().init();
    try {
        if ((await db.select(querysql) as any).length > 0) {
            return (await db.execute(delsql)).rowsAffected > 0 ? true : false;
        } else {
            throw new Error(`Delete: ${TableName} with ${ColumnName} = '${ColumnValue}' not found!`);
        }
    } catch (e) {
        throw e;
    }
}



/**
 *
 * Simple insert to insert one row into a table.
 * @param TableName the name of the table to insert into.
 * @param data the data to insert into the table.
 * @returns a promise that resolves to the number of rows affected.
 */
export const simpleInsert = async <T extends Record<string, any>>(TableName: string, data: T[]): Promise<number> => {
    const db = await new DBConn().init();
    let rowsAffected = 0;
    const columns = Object.keys(data[0]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const columnList = columns.join(', ');
    const sql = `INSERT INTO ${TableName} (${columnList}) VALUES (${placeholders})`;
    const promises = data.map(item => {
        const values = columns.map(column => item[column]);
        return db.execute(sql, values);
    });
    const results = await Promise.all(promises);
    rowsAffected = results.reduce((total, res) => total + res.rowsAffected, 0);
    await db.close();
    return rowsAffected;
};
