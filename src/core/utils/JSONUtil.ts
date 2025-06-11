// e:\Projects\Node\Tauri\CS2H\src\utils\JSONUtil.ts

import { LRUCache } from 'lru-cache';

// 使用 LRU 缓存避免重复解析相同字符串
const PARSE_CACHE = new LRUCache<string, any>({ max: 100 });

/**
 * 深度解析 JSON 字符串，支持嵌套对象和数组。
 * 如果输入已经是对象，则递归解析其字段中的 JSON 字符串。
 *
 * @param input - 要解析的内容，可以是 JSON 字符串或对象/数组
 * @returns 解析后的 JavaScript 对象或数组
 */
export function deepParseJSON<T = any>(input: string | T): T {
    // 空值直接返回
    if (input === null || input === undefined) {
        return input as T;
    }

    // 如果是字符串，尝试解析
    if (typeof input === 'string') {
        const cached = PARSE_CACHE.get(input);
        if (cached !== undefined) {
            return cached as T;
        }

        try {
            const parsed = JSON.parse(input);
            const result = deepParseJSON(parsed);
            PARSE_CACHE.set(input, result);
            return result as T;
        } catch {
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
                result[key] = deepParseJSON(input[key]);
            }
        }
        return result as T;
    }

    // 基本类型直接返回
    return input;
}

/**
 * 深度序列化对象中的所有值，将其转换为 JSON 字符串。
 * 支持嵌套对象、数组等结构。
 *
 * @param input - 要序列化的对象
 * @returns 序列化后的对象，其中所有可序列化的值都被转为 JSON 字符串
 */
export function deepStringifyJSON<T = any>(input: T): Record<keyof T, string> {
    // 如果是数组，单独处理
    if (Array.isArray(input)) {
        return input.map(item => JSON.stringify(item)) as any;
    }

    // 如果是对象，递归处理每个属性
    if (typeof input === 'object' && input !== null) {
        const result: Record<string, string> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const value = input[key as keyof T];
                result[key] = JSON.stringify(value);
            }
        }
        return result as Record<keyof T, string>;
    }

    // 基本类型直接字符串化
    return { value: JSON.stringify(input) } as Record<keyof T, string>;
}