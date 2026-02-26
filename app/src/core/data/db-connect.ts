import Database from "@tauri-apps/plugin-sql";
import LogService from "@/core/service/log-service";
import { path } from "@tauri-apps/api";
import { DBResult } from "../types/database";


class dbConnect {
    private static instance: dbConnect;
    private db: Database | null = null;
    private isInitialized: boolean = false;

    private constructor() { }

    public static getInstance(): dbConnect {
        if (!dbConnect.instance) {
            dbConnect.instance = new dbConnect();
        }
        return dbConnect.instance;
    }

    /**
     * Check if the database is connected
     * @returns boolean indicating connection status
     */
    public isDbConnected(): boolean {
        return this.isInitialized && !!this.db;
    }

    /**
     * Initialize the database connection
     * @returns Promise<boolean> indicating success or failure
     */
    public async init(): Promise<boolean> {
        if (this.isInitialized) return true;

        try {
            const dbName = 'csa.sqlite';
            const fullPath = await path.join(await path.appLocalDataDir(), dbName);
            this.db = await Database.load(`sqlite:${fullPath}`);
            this.isInitialized = true;
            LogService.log(`[DB] Database connected successfully!`);
            return true;
        } catch (error) {
            this.isInitialized = false;
            throw LogService.error(`[DB] Init database connection failed: ${error}`);
        }
    }

    /**
     * Get the database connection instance
     * @returns Promise<Database> resolving to the Database instance
     */
    public async getConnection(): Promise<Database> {
        if (!this.isInitialized || !this.db) {
            const success = await this.init();
            if (!success) {
                throw LogService.error("[DB] Failed to establish database connection");
            }
        }
        return this.db!;
    }

    public async close(): Promise<boolean> {
        if (!this.isInitialized || !this.db) {
            return true;
        }
        try {
            await this.db.close();
            this.db = null;
            this.isInitialized = false;
            LogService.log('[DB] Database connection closed.');
            return true;
        } catch (error) {
            LogService.error(`[DB] Error closing database: ${error}`);
            return false;
        }
    }
}

/**
 *  Query the database
 * @param sql  sql statement
 * @param params  parameters
 * @returns  Promise<T[]>
 */
const query = async <T>(sql: string, params?: any[]): Promise<T[]> => {
    const db = await dbConnect.getInstance().getConnection();
    return db.select<T[]>(sql, params);
};

/**
 * Execute a SQL statement
 * @param sql  sql statement
 * @param params  parameters
 * @returns  Promise<DBResult>
 */
const execute = async (sql: string, params?: any[]): Promise<DBResult> => {
    const db = await dbConnect.getInstance().getConnection();
    return (await db.execute(sql, params));
};

/**
 * Execute a SQL statement in a transaction
 * @param sql  sql statement
 * @param params  parameters
 * @returns  Promise<DBResult>
 * @deprecated 暂不支持
 */
const transaction = async (sql: string[], params?: any[][]): Promise<DBResult> => {

    const db = await dbConnect.getInstance().getConnection();
    // 手动实现事务
    await db.execute("BEGIN TRANSACTION;");
    for (let i = 0; i < sql.length; i++) {
        await db.execute(sql[i], params?.[i]);
    }
    const res = await db.execute("COMMIT;");
    return {
        rowsAffected: res.rowsAffected,
        lastInsertId: res.lastInsertId
    };
};

export const dbExecutor = { query, execute, transaction };

export default dbConnect.getInstance() as dbConnect;
