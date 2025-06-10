export class DateUtils {
    /**
     * 生成格式为 YYYY-MM-DD_HH-mm-SS-MS 的时间戳文件夹名称
     * 示例：2024-07-24_15-30-45-123
     *
     * @returns {string} 格式化后的时间戳文件夹名称
     */
    static generateTimestampFolderName(): string {
        const now = new Date();

        const year = now.getFullYear(); // 四位年份
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
        const day = String(now.getDate()).padStart(2, '0');

        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const millisecond = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day}_${hour}-${minute}-${second}-${millisecond}`;
    }

    /**
     * 格式化任意日期为 YYYY-MM-DD HH:mm:ss 格式
     * @param date 
     * @returns 
     */
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
}