class JSONUtil {
    private static instance: JSONUtil
    private constructor() { }
    public static getInstance(): JSONUtil {
        if (!JSONUtil.instance) {
            JSONUtil.instance = new JSONUtil();
        }
        return JSONUtil.instance;
    }

    /**
     * 深度解析 JSON，输入可以是 JSON 字符串或已经解析的 JSON 对象
     * @param input 要解析的 JSON 字符串或 JSON 对象
     * @returns 解析后的 JavaScript 对象/数组
     */
    public deepParseJSON(input: any): any {
        // 如果输入是 null 或 undefined，直接返回
        if (input === null || input === undefined) {
            return input;
        }

        // 如果输入是字符串，尝试解析它
        if (typeof input === 'string') {
            try {
                // 尝试将输入解析为 JSON
                const parsedData = JSON.parse(input);
                // 递归处理解析后的结果
                return this.deepParseJSON(parsedData);
            } catch (e) {
                // 如果解析失败，说明不是有效的 JSON 字符串，直接返回原始字符串
                return input;
            }
        }

        // 如果输入已经是对象或数组，递归处理它的属性
        if (typeof input === 'object') {
            if (Array.isArray(input)) {
                // 处理数组
                return input.map(item => this.deepParseJSON(item));
            } else {
                // 处理对象
                const result: any = {};
                for (const key in input) {
                    if (Object.prototype.hasOwnProperty.call(input, key)) {
                        result[key] = this.deepParseJSON(input[key]);
                    }
                }
                return result;
            }
        }

        // 基本类型（number, boolean 等）直接返回
        return input;
    }

    /**
     * 辅助方法：深度解析对象中的所有可能 JSON 字符串
     * @param obj 要处理的对象
     * @returns 处理后的对象
     */
    private deepParseObject(obj: any): any {
        const result: any = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];

                if (typeof value === 'string') {
                    try {
                        // 尝试将字符串值解析为 JSON
                        result[key] = this.deepParseJSON(value);
                    } catch (e) {
                        // 如果解析失败，保持原始字符串
                        result[key] = value;
                    }
                } else if (value !== null && typeof value === 'object') {
                    if (Array.isArray(value)) {
                        // 递归处理数组
                        result[key] = value.map(item => {
                            if (typeof item === 'string') {
                                try {
                                    return this.deepParseJSON(item);
                                } catch (e) {
                                    return item;
                                }
                            } else if (item !== null && typeof item === 'object') {
                                return this.deepParseObject(item);
                            }
                            return item;
                        });
                    } else {
                        // 递归处理对象
                        result[key] = this.deepParseObject(value);
                    }
                } else {
                    // 保持基本类型值不变
                    result[key] = value;
                }
            }
        }

        return result;
    }

}


export const jsonUtil = JSONUtil.getInstance();