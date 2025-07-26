/**
 * 深度序列化对象中的所有值，将其转换为 JSON 字符串。
 * 支持嵌套对象、数组等结构。
 * 
 * @param input - 要序列化的对象
 * @returns 序列化后的对象，其中所有可序列化的值都被转为 JSON 字符串
 * 
 * @example
 * const obj = { name: 'John', details: { age: 30 } };
 * const serialized = deepStringifyJSON(obj);
 * // 结果: { name: '"John"', details: '{"age":30}' }
 */
export function deepStringifyJSON<T extends Record<string, any>>(input: T): { [K in keyof T]: string } {
    // 如果是数组，单独处理
    if (Array.isArray(input)) {
        return input.map(item => JSON.stringify(item)) as any;
    }

    // 如果是对象，递归处理每个属性
    if (typeof input === 'object' && input !== null) {
        const result: Record<string, string> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const value = input[key];
                result[key] = typeof value === 'string' ? value : JSON.stringify(value);
            }
        }
        return result as { [K in keyof T]: string };
    }

    // 基本类型处理
    return { value: JSON.stringify(input) } as any;
}

/**
 * 安全序列化对象为 JSON 字符串
 * 
 * @param input - 要序列化的对象
 * @param fallback - 序列化失败时的回退值
 * @returns JSON 字符串或回退值
 */
export function safeStringifyJSON(input: any, fallback: string = '{}'): string {
    try {
        return JSON.stringify(input);
    } catch {
        return fallback;
    }
}