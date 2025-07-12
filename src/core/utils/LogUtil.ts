


class LogUtil {
    private static instance: LogUtil;

    private constructor() { }

    public static getInstance(): LogUtil {
        if (!LogUtil.instance) {
            LogUtil.instance = new LogUtil();
        }
        return LogUtil.instance;
    }

    log = (msg: any, ...args: any[]) => {
        console.log(msg, ...args);
    }
    error = (msg: any, ...args: any[]) => {
        console.error(msg, ...args)
    }
    warning = (msg: any, ...args: any[]) => {
        console.warn(msg, ...args)
    }
    info = (msg: any, ...args: any[]) => {
        console.info(msg, ...args)
    }
    debug = (msg: any, ...args: any[]) => {
        console.trace(msg, ...args)
    }

}

export default LogUtil.getInstance();