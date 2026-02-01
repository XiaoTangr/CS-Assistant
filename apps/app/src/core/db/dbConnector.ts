import Database from "@tauri-apps/plugin-sql";
import { LogService } from "../services";
import { path } from "@tauri-apps/api";

export class dbConnecter {
    private static instance: dbConnecter;
    private db: Database | null = null;
    private isInitialized: boolean = false;

    private constructor() { }

    public static getInstance(): dbConnecter {
        if (!dbConnecter.instance) {
            dbConnecter.instance = new dbConnecter();
        }
        return dbConnecter.instance;
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

export const db = dbConnecter.getInstance();
