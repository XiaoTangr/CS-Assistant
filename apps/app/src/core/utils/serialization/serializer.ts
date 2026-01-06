/**
 * 序列化对象为JSON字符串
 */
export const stringifyToJson = <T extends Record<string, any> | any[]>(
    input: T,
    fallback: string = '{}'
): string => {
    try {
        return JSON.stringify(input);
    } catch {
        return fallback;
    }
};

/**
 * 深度序列化对象值（保持结构，仅序列化值）
 */
export const deepStringifyValues = <T extends Record<string, any> | any[]>(
    input: T
): T => {
    if (input === null || input === undefined) {
        return input;
    }

    if (Array.isArray(input)) {
        return input.map(item => {
            if (typeof item === 'object' && item !== null) {
                return deepStringifyValues(item);
            }
            return typeof item === 'string' ? item : JSON.stringify(item);
        }) as T;
    }

    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const value = input[key];
                if (typeof value === 'object' && value !== null) {
                    result[key] = deepStringifyValues(value);
                } else {
                    result[key] = typeof value === 'string' ? value : JSON.stringify(value);
                }
            }
        }
        return result as T;
    }

    return input;
};

/**
 * 解析JSON字符串为对象
 */
export const parseFromJson = <T extends Record<string, any> | any[]>(
    input: string,
    fallback?: T,
    options: { trim?: boolean } = { trim: true }
): T | undefined => {
    try {
        const text = options.trim ? input.trim() : input;
        return JSON.parse(text);
    } catch {
        return fallback;
    }
};

/**
 * 深度解析对象值（保持结构，仅解析值）
 */
export const deepParseValues = <T extends Record<string, any> | any[]>(
    input: T
): T => {
    if (input === null || input === undefined) {
        return input;
    }

    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            if (typeof parsed === 'object') {
                return deepParseValues(parsed);
            }
            return parsed;
        } catch {
            return input;
        }
    }

    if (Array.isArray(input)) {
        return input.map(item => deepParseValues(item)) as T;
    }

    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                result[key] = deepParseValues(input[key] as any);
            }
        }
        return result as T;
    }

    return input;
};

/**
 * 深度解析JSON字符串（先解析外层，再递归解析内层）
 */
export const deepParseJson = <T extends Record<string, any> | any[]>(
    input: string,
    fallback?: T,
    options: { trim?: boolean } = { trim: true }
): T | undefined => {
    try {
        const text = options.trim ? input.trim() : input;
        const parsed = parseFromJson<T>(text, undefined, { trim: false });
        return parsed !== undefined ? deepParseValues(parsed) : fallback;
    } catch {
        return fallback;
    }
};

export const JsonUtils = {
    stringifyToJson,
    parseFromJson,
    deepStringifyValues,
    deepParseValues,
    deepParseJson
}
