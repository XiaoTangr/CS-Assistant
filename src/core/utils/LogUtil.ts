export const printLog = (msg: any, ...args: any[]) => {
    console.log(msg, ...args);
}
export const printError = (msg: any, ...args: any[]) => {
    console.error(msg, ...args)
}
export const printWarn = (msg: any, ...args: any[]) => {
    console.warn(msg, ...args)
}
export const printInfo = (msg: any, ...args: any[]) => {
    console.info(msg, ...args)
}
export const printDebug = (msg: any, ...args: any[]) => {
    console.trace(msg, ...args)
}


class LogUtil {
    private static instance: LogUtil;

    private constructor() { }

    public static getInstance(): LogUtil {
        if (!LogUtil.instance) {
            LogUtil.instance = new LogUtil();
        }
        return LogUtil.instance;
    }


}

export default LogUtil.getInstance();