import Database from "@tauri-apps/plugin-sql";

export class DBConnUtil {
    private static instance: DBConnUtil; // 单例实例
    private pool: Database[] = []; // 连接池
    private maxPoolSize: number; // 最大连接数
    private isInitialized: boolean = false; // 是否已初始化

    /**
     * 私有构造函数，确保单例模式
     * @param maxPoolSize - 连接池最大连接数
     */
    private constructor(maxPoolSize: number = 10) {
        this.maxPoolSize = maxPoolSize;
    }

    /**
     * 获取单例实例
     * @param maxPoolSize - 连接池最大连接数
     * @returns 返回单例实例
     */
    public static getInstance(maxPoolSize: number = 5): DBConnUtil {
        if (!DBConnUtil.instance) {
            DBConnUtil.instance = new DBConnUtil(maxPoolSize);
        }
        return DBConnUtil.instance;
    }

    /**
     * 初始化连接池
     */
    public async init(): Promise<void> {
        if (this.isInitialized) {
            return; // 避免重复初始化
        }

        try {
            for (let i = 0; i < this.maxPoolSize; i++) {
                const db = await Database.load("sqlite:cs2h.db");
                this.pool.push(db);
            }
            this.isInitialized = true;
            console.log("数据库连接池初始化成功");
        } catch (error) {
            console.error("数据库连接池初始化失败:", error);
            throw new Error("无法初始化数据库连接池");
        }
    }

    /**
     * 从连接池中获取一个数据库连接
     * @returns 返回数据库实例
     * @throws 如果连接池未初始化或已满，抛出错误
     */
    public async getConnection(): Promise<Database> {
        if (!this.isInitialized) {
            throw new Error("连接池未初始化，请先调用 init() 方法");
        }

        if (this.pool.length > 0) {
            return this.pool.pop()!; // 从连接池中取出一个连接

        } else {
            throw new Error("连接池已满，请稍后再试");
        }
    }

    /**
     * 释放数据库连接回连接池
     * @param db - 数据库实例
     */
    public releaseConnection(db: Database): void {
        if (this.pool.length < this.maxPoolSize) {
            console.log("释放数据库连接");
            this.pool.push(db); // 将连接放回连接池
        } else {
            db.close(); // 如果连接池已满，直接关闭连接
        }
    }

    /**
     * 关闭连接池中的所有连接
     */
    public async closePool(): Promise<void> {
        if (!this.isInitialized) {
            return; // 如果未初始化，直接返回
        }

        try {
            for (const db of this.pool) {
                await db.close();
            }
            this.pool = []; // 清空连接池
            this.isInitialized = false; // 标记为未初始化
            console.log("数据库连接池已关闭");
        } catch (error) {
            console.error("关闭数据库连接池失败:", error);
        }
    }
}

// 导出单例对象
export const dbConnUtil = DBConnUtil.getInstance();