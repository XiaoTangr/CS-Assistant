/**
 * 深度解析 JSON 字符串，支持嵌套对象和数组。
 * 如果输入已经是对象，则递归解析其字段中的 JSON 字符串。
 * 
 * @param input - 要解析的内容，可以是 JSON 字符串或对象/数组
 * @returns 解析后的 JavaScript 对象或数组
 * 
 * @example
 * // 解析简单 JSON 字符串
 * const result = deepParseJSON('{"name": "John", "age": 30}');
 * 
 * // 解析嵌套对象中的字符串字段
 * const nested = deepParseJSON({user: '{"name": "John"}', active: "true"});
 */
export function deepParseJSON<T = any>(input: string | T): T {
    // 空值直接返回
    if (input === null || input === undefined) {
        return input as T;
    }

    // 如果是字符串，尝试解析
    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            return deepParseJSON(parsed) as T;
        } catch {
            // 解析失败时返回原始字符串
            return input as T;
        }
    }

    // 如果是数组，递归解析每个元素
    if (Array.isArray(input)) {
        return input.map(item => deepParseJSON(item)) as T;
    }

    // 如果是对象，递归解析每个属性
    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                result[key] = deepParseJSON((input as Record<string, any>)[key]);
            }
        }
        return result as T;
    }

    // 基本类型直接返回
    return input;
}

/**
 * 安全解析 JSON 字符串，提供错误处理选项
 * 
 * @param input - 要解析的 JSON 字符串
 * @param fallback - 解析失败时的回退值
 * @returns 解析后的对象或回退值
 */
export function safeParseJSON<T>(input: string, fallback?: T): T | undefined {
    try {
        return JSON.parse(input);
    } catch {
        return fallback;
    }
}