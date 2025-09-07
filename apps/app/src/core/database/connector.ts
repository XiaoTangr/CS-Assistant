import Database from "@tauri-apps/plugin-sql";
import { LogService } from "../services";
export class connecter {
    private static instance: connecter;
    private db: Database | null = null;
    private isInitialized: boolean = false;
    private initPromise: Promise<boolean> | null = null;

    private constructor() { }

    public static getInstance(): connecter {
        if (!connecter.instance) {
            connecter.instance = new connecter();
        }
        return connecter.instance;
    }

    private log(message: string) {
        LogService.log(`[DB connecter] ${message}`);
    }

    public isDbConnected(): boolean {
        return this.isInitialized && !!this.db;
    }

    public async init(): Promise<boolean> {
        if (this.isInitialized) return true;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                const dbName = 'csa.sqlite';
                this.db = await Database.load(`sqlite:${dbName}`);
                this.isInitialized = true;
                this.log(`Database connected successfully!`);
                return true;
            } catch (error) {
                this.isInitialized = false;
                this.log(`Init failed: ${error}`);
                throw new Error(`Init database connection failed: ${error}`);
            } finally {
                this.initPromise = null;
            }
        })();

        return this.initPromise;
    }

    public async getConnection(): Promise<Database> {
        if (!this.isInitialized || !this.db) {
            await this.init();
        }

        if (this.db) {
            return this.db;
        } else {
            throw new Error("Failed to establish database connection");
        }
    }

    public async close(): Promise<boolean> {
        if (!this.isInitialized || !this.db) {
            return true;
        }

        try {
            await this.db.close();
            this.db = null;
            this.isInitialized = false;
            this.log('Database connection closed.');
            return true;
        } catch (error) {
            this.log(`Error closing database: ${error}`);
            return false;
        }
    }
}

export default connecter.getInstance();
