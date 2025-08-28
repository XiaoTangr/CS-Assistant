/**
 * 日志服务
 */
class LogService {
    private static instance: LogService;

    /**
     * 日志级别
     * - 0: 日志，信息，警告和错误
     * - 1: 信息，警告和错误
     * - 2: 警告和错误
     * - 3: 仅错误
     */
    private logLevel: number = 0;


    private constructor() { }

    public static getInstance(): LogService {
        if (!LogService.instance) {
            LogService.instance = new LogService();
        }
        return LogService.instance;
    }

    /**
     * 设置日志级别
     * @param level 日志级别:
     * - 0: 日志，信息，警告和错误
     * - 1: 信息，警告和错误
     * - 2: 警告和错误
     * - 3: 仅错误
     */
    public setLogLevel(level: number): void {
        if (level >= 0 && level <= 3) {
            this.logLevel = level;
            this.warn(`[LogService] Set Log Level to :`, this.logLevel);
        } else {
            LogService.getInstance().error("Invalid log level: " + level);
        }
    }

    /**
     * 获取当前日志级别
     * @returns 当前日志级别
     * - 0: 日志，信息，警告和错误
     * - 1: 信息，警告和错误
     * - 2: 警告和错误
     * - 3: 仅错误
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
     * 记录普通日志 (LOG)
     * @param msg 日志消息
     * @param args 可选参数
     */
    log = (msg: any, ...args: any[]) => {
        if (this.shouldLog(0)) { // LOG 级别为 1
            let message = `[Log]`;
            // 如果是字符串，则添加到前缀作为message参数，以便正确处理占位符
            if (typeof msg === 'string') {
                message = `${message} ${msg}`;
            } else {
                args = [msg, ...args];
            }
            console.log(message, ...args);
        }
    }

    /**
     * 记录信息日志 (INFO)
     * @param msg 信息消息
     * @param args 可选参数
     */
    info = (msg: any, ...args: any[]) => {
        if (this.shouldLog(1)) { // INFO 级别为 0
            let message = `[Info]`;
            // 如果是字符串，则添加到前缀作为message参数，以便正确处理占位符
            if (typeof msg === 'string') {
                message = `${message} ${msg}`;
            } else {
                args = [msg, ...args];
            }
            console.info(message, ...args);
        }
    }





    /**
     * 记录警告日志 (WARN)
     * @param msg 警告消息
     * @param args 可选参数
     */
    warn = (msg: any, ...args: any[]) => {
        if (this.shouldLog(2)) { // WARN 级别为 2
            let message = `[Warn]`;
            // 如果是字符串，则添加到前缀作为message参数，以便正确处理占位符
            if (typeof msg === 'string') {
                message = `${message} ${msg}`;
            } else {
                args = [msg, ...args];
            }
            console.warn(message, ...args);
        }
    }

    /**
     * 记录错误日志 (ERROR)
     * @param msg 错误消息
     * @param args 可选参数
     */
    error = (msg: any, ...args: any[]) => {
        if (this.shouldLog(3)) { // ERROR 级别为 3
            let message = `[Error]`;
            // 如果是字符串，则添加到前缀作为message参数，以便正确处理占位符
            if (typeof msg === 'string') {
                message = `${message} ${msg}`;
            } else {
                args = [msg, ...args];
            }
            console.error(message, ...args);
        }
    }

    /**
     * 调试
     * @param msg 调试消息
     * @param args 可选参数
     */
    debug = (msg: any, ...args: any[]) => {




        const colors = {
            reset: '\x1b[0m',
            fontYellow: '\x1b[33m',
            bold: "\x1b[1m"
        }

        if (process.env.NODE_ENV === 'development') {

            let message = `${colors.bold}${colors.fontYellow}[Debug]${colors.reset}`;
            // 如果是字符串，则添加到前缀作为message参数，以便正确处理占位符
            if (typeof msg === 'string') {
                message = `${message} ${msg}`;
            } else {
                args = [msg, ...args];
            }
            console.trace(message, ...args)
        }
    }
}

export default LogService.getInstance();
