/**
 * 将时间戳转为文件夹名称 (兼容Linux和Windows)
 * 格式：YYYY-MM-DD_HH-mm-SS-MS
 * 示例：2024-07-24_15-30-45-123
 *
 * @param {number} timestamp? - 时间戳(可选)
 * @returns {string} 格式化后的文件夹名称
 */
export const timestampToFolderName = (timestamp?: number): string => {
    const date = new Date(timestamp ?? Date.now());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const millisecond = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}_${hour}-${minute}-${second}-${millisecond}`;
}

/**
 * 获取当前时间戳
 * @returns {number} 当前时间戳
 */
export const getCurrentTimestamp = (): number => {
    return Date.now();
}

/**
 * 将时间戳格式化为: YYYY-MM-DD HH:mm:ss
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    let r = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return r;
}
