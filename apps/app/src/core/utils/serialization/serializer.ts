import JSON5 from 'json5';

/**
 * 序列化对象为JSON5字符串
 */
export const toJSON5 = <T extends Record<string, any> | any[]>(
    input: T,
    fallback: string = '{}'
): string => {
    try {
        return JSON5.stringify(input);
    } catch {
        return fallback;
    }
};

/**
 * 深度序列化对象值（保持结构，仅序列化值）
 */
export const serializeDeepValues = <T extends Record<string, any> | any[]>(
    input: T
): T => {
    if (input === null || input === undefined) {
        return input;
    }

    if (Array.isArray(input)) {
        return input.map(item => {
            if (typeof item === 'object' && item !== null) {
                return serializeDeepValues(item);
            }
            return typeof item === 'string' ? item : JSON5.stringify(item);
        }) as T;
    }

    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const value = input[key];
                if (typeof value === 'object' && value !== null) {
                    result[key] = serializeDeepValues(value);
                } else {
                    result[key] = typeof value === 'string' ? value : JSON5.stringify(value);
                }
            }
        }
        return result as T;
    }

    return input;
};

/**
 * 解析JSON5字符串为对象
 */
export const fromJSON5 = <T extends Record<string, any> | any[]>(
    input: string,
    fallback?: T,
    options: { trim?: boolean } = { trim: true }
): T | undefined => {
    try {
        const text = options.trim ? input.trim() : input;
        return JSON5.parse(text);
    } catch {
        return fallback;
    }
};

/**
 * 深度解析对象值（保持结构，仅解析值）
 */
export const deserializeDeepValues = <T extends Record<string, any> | any[]>(
    input: T
): T => {
    if (input === null || input === undefined) {
        return input;
    }

    if (typeof input === 'string') {
        try {
            const parsed = JSON5.parse(input);
            if (typeof parsed === 'object') {
                return deserializeDeepValues(parsed);
            }
            return parsed;
        } catch {
            return input;
        }
    }

    if (Array.isArray(input)) {
        return input.map(item => deserializeDeepValues(item)) as T;
    }

    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                result[key] = deserializeDeepValues(input[key] as any);
            }
        }
        return result as T;
    }

    return input;
};

/**
 * 深度解析JSON5字符串（先解析外层，再递归解析内层）
 */
export const deepParseJSON5 = <T extends Record<string, any> | any[]>(
    input: string,
    fallback?: T,
    options: { trim?: boolean } = { trim: true }
): T | undefined => {
    try {
        const text = options.trim ? input.trim() : input;
        const parsed = fromJSON5<T>(text, undefined, { trim: false });
        return parsed !== undefined ? deserializeDeepValues(parsed) : fallback;
    } catch {
        return fallback;
    }
};

/**
 * 工具函数别名 - 提供更简洁的调用方式
 */
export const json5 = {
    /** 序列化对象为JSON5字符串 */
    stringify: toJSON5,
    /** 解析JSON5字符串为对象 */
    parse: fromJSON5,
    /** 深度序列化对象值 */
    serializeValues: serializeDeepValues,
    /** 深度解析对象值 */
    deserializeValues: deserializeDeepValues,
    /** 深度解析JSON5字符串 */
    deepParse: deepParseJSON5
};
