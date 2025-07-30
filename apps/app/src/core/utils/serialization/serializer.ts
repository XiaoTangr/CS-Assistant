/**
 * 将整个对象或数组序列化为 JSON 字符串
 * 支持对象和数组类型，提供错误处理机制
 * 
 * @param input - 要序列化的对象或数组
 * @param fallback - 序列化失败时的回退值，默认为 '{}'
 * @returns JSON 字符串或回退值
 * 
 * @example
 * const obj = { name: 'John', age: 30 };
 * const serialized = serializeObject(obj);
 * // 结果: '{"name":"John","age":30}'
 */
export function serializeObject<T extends Record<string, any> | any[]>(input: T, fallback: string = '{}'): string {
    try {
        return JSON.stringify(input);
    } catch {
        return fallback;
    }
}

/**
 * 深度序列化对象或数组中的所有值，仅将值转换为 JSON 字符串
 * 保持对象/数组结构不变，只序列化其中的值
 * 
 * @param input - 要序列化的对象或数组
 * @returns 序列化后的对象或数组，其中所有值都被转为 JSON 字符串
 * 
 * @example
 * const obj = { user: { name: 'John' }, active: true };
 * const serialized = serializeValues(obj);
 * // 结果: { user: '{"name":"John"}', active: "true" }
 */
export function serializeValues<T extends Record<string, any> | any[]>(input: T): T {
    // 处理 null 或 undefined
    if (input === null || input === undefined) {
        return input;
    }

    // 如果是数组，处理每个元素
    if (Array.isArray(input)) {
        return input.map(item => {
            // 如果元素是对象或数组，递归处理；否则直接序列化
            if (typeof item === 'object' && item !== null) {
                return serializeValues(item);
            }
            return typeof item === 'string' ? item : JSON.stringify(item);
        }) as T;
    }

    // 如果是对象，递归处理每个属性值
    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                const value = input[key];
                // 如果值是对象或数组，递归处理；否则直接序列化
                if (typeof value === 'object' && value !== null) {
                    result[key] = serializeValues(value);
                } else {
                    result[key] = typeof value === 'string' ? value : JSON.stringify(value);
                }
            }
        }
        return result as T;
    }

    // 基本类型直接返回
    return input;
}


/**
 * 解析整个 JSON 字符串为对象或数组
 * 
 * @param input - 要解析的 JSON 字符串
 * @param fallback - 解析失败时的回退值
 * @returns 解析后的对象或数组，或回退值
 * 
 * @example
 * const str = '{"name": "John", "age": 30}';
 * const parsed = deserializeObject(str);
 * // 结果: {name: "John", age: 30}
 */
export function deserializeObject<T extends Record<string, any> | any[]>(input: string, fallback?: T): T | undefined {
    try {
        return JSON.parse(input);
    } catch {
        return fallback;
    }
}

/**
 * 深度解析对象或数组中的字符串值，将字符串形式的 JSON 转换为对象
 * 保持对象/数组结构不变，只解析其中的字符串值
 * 
 * @param input - 要解析的对象或数组
 * @returns 解析后的对象或数组，其中字符串形式的 JSON 都被转换为对象
 * 
 * @example
 * const obj = {user: '{"name": "John"}', active: "true"};
 * const parsed = deserializeValues(obj);
 * // 结果: {user: {name: "John"}, active: true}
 */
export function deserializeValues<T extends Record<string, any> | any[]>(input: T): T {
    // 处理 null 或 undefined
    if (input === null || input === undefined) {
        return input;
    }

    // 如果是字符串，尝试解析
    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            // 如果解析结果是对象或数组，递归处理
            if (typeof parsed === 'object') {
                return deserializeValues(parsed);
            }
            // 否则返回解析结果
            return parsed;
        } catch {
            // 解析失败时返回原始字符串
            return input;
        }
    }

    // 如果是数组，处理每个元素
    if (Array.isArray(input)) {
        return input.map(item => deserializeValues(item)) as T;
    }

    // 如果是对象，递归处理每个属性值
    if (typeof input === 'object') {
        const result: Record<string, any> = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                result[key] = deserializeValues(input[key] as any);
            }
        }
        return result as T;
    }

    // 基本类型直接返回
    return input;
}
