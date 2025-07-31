

class LogServices {
    private static instance: LogServices;

    /**
     * 日志级别
     * 0: DEBUG（最低级别，记录所有信息）
     * 1: INFO（记录信息、警告和错误）
     * 2: WARN（记录警告和错误）
     * 3: ERROR（只记录错误）
     */
    private logLevel: number = 2;


    private constructor() {
    }

    public static getInstance(): LogServices {
        if (!LogServices.instance) {
            LogServices.instance = new LogServices();
        }
        return LogServices.instance;
    }

    /**
     * 设置日志级别
     * @param level 日志级别 (0: DEBUG, 1: INFO, 2: WARN, 3: ERROR)
     */
    public setLogLevel(level: number): void {
        if (level >= 0 && level <= 3) {
            this.logLevel = level;
        } else {
            LogServices.getInstance().error("Invalid log level: " + level);
        }
    }

    /**
     * 获取当前日志级别
     * @returns 当前日志级别
     */
    public getLogLevel(): number {
        return this.logLevel;
    }

    /**
     * 检查指定级别的日志是否应该被记录
     * @param level 要检查的日志级别
     * @returns 是否应该记录该级别日志
     */
    private shouldLog(level: number): boolean {
        return level >= this.logLevel;
    }

    /**
     * 记录普通日志
     * @param msg 日志消息
     * @param args 可选参数
     */
    log = (msg: any, ...args: any[]) => {
        if (this.shouldLog(1)) { // LOG级别视为INFO级别
            console.log('[Log]', msg, ...args);
        }
    }


    /**
     * 记录信息日志
     * @param msg 信息消息
     * @param args 可选参数
     */
    info = (msg: any, ...args: any[]) => {
        if (this.shouldLog(1)) {
            console.info('[Info]', msg, ...args);
        }
    }


    /**
     * 记录警告日志
     * @param msg 警告消息
     * @param args 可选参数
     */
    warn = (msg: any, ...args: any[]) => {
        if (this.shouldLog(2)) {
            console.warn('[Warn]', msg, ...args);
        }
    }


    /**
     * 记录错误日志
     * @param msg 错误消息
     * @param args 可选参数
     */
    error = (msg: any, ...args: any[]) => {
        if (this.shouldLog(3)) {
            console.error('[Error]', msg, ...args);
        }
    }


    /**
     * 记录调试日志
     * @param msg 调试消息
     * @param args 可选参数
     */
    debug = (msg: any, ...args: any[]) => {
        if (this.shouldLog(0)) {
            console.debug('[Debug]', msg, ...args);
        }
    }
}

export default LogServices.getInstance();