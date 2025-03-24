import Database from "@tauri-apps/plugin-sql";

export class DBConnUtil {
    private static instance: DBConnUtil; // 单例实例
    private db: Database | null = null; // 单个数据库连接
    private isInitialized: boolean = false; // 是否已初始化

    /**
     * 私有构造函数，确保单例模式
     */
    private constructor() {
        // 私有构造函数不需要参数，因为我们只使用一个连接
    }

    /**
     * 获取单例实例
     * @returns 返回单例实例
     */
    public static getInstance(): DBConnUtil {
        if (!DBConnUtil.instance) {
            DBConnUtil.instance = new DBConnUtil();
        }
        return DBConnUtil.instance;
    }

    /**
     * 初始化数据库连接
     */
    public async init(): Promise<boolean> {
        if (this.isInitialized) {
            return true; // 避免重复初始化
        }
        try {
            this.db = await Database.load("sqlite:cs2h.db");
            this.isInitialized = true;
            return true;
        } catch (error) {
            throw new Error(`Init database connection failed: ${error}`);
        }
    }

    /**
     * 获取数据库连接
     * @returns 返回数据库实例
     * @throws 如果连接未初始化，抛出错误
     */
    public async getConnection(): Promise<Database> {
        if (!this.isInitialized || !this.db) {
            await this.init(); // 尝试初始化连接
        }

        if (this.db) {
            return this.db;
        } else {
            throw new Error("Failed to establish database connection");
        }
    }

    /**
     * 关闭数据库连接
     * 注意：在使用单个连接的模式中，我们通常不会在每次操作后关闭连接
     * 而是在应用程序退出时关闭
     */
    public async close(): Promise<boolean> {
        if (!this.isInitialized || !this.db) {
            return true; // 如果连接尚未初始化，认为关闭成功
        }

        try {
            await this.db.close();
            this.db = null;
            this.isInitialized = false;
            return true;
        } catch (error) {
            console.error(`Error closing database connection: ${error}`);
            return false;
        }
    }


}

// 导出单例对象
export const dbConnUtil = DBConnUtil.getInstance();