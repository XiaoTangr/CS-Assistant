import { deepParseValues, deepStringifyValues } from './serializer';

/**
 * 通用数据库结构与应用结构之间的转换工具
 * 用于在数据库结构（以 t_ 前缀命名的接口，字段以 c_ 前缀）和应用结构（普通命名接口和字段）之间进行转换
 */
/**
 * 通用转换函数：将数据库结构对象转换为应用结构对象
 * @param dbObj 数据库结构对象
 * @returns 应用结构对象
 */
export function fromDb<T extends Record<string, any>>(dbObj: T): any | null {

    if (dbObj === null || dbObj === undefined) {
        return null;
    }

    // 如果是数组，递归处理每个元素
    if (Array.isArray(dbObj)) {
        return dbObj.map(item => fromDb(item));
    }

    // 如果是对象，进行字段名转换
    if (typeof dbObj === 'object') {
        const result: Record<string, any> = {};
        for (const key in dbObj) {
            if (Object.prototype.hasOwnProperty.call(dbObj, key)) {
                if (key.startsWith('c_')) {
                    // 移除字段名前缀 'c_'
                    const newKey = key.substring(2);
                    // 使用 serializer 中的方法深度解析值
                    result[newKey] = deepParseValues(dbObj[key]);
                } else {
                    result[key] = dbObj[key];
                }
            }
        }
        return result;
    }

    // 基本类型直接返回
    return dbObj;
}

/**
 * 通用转换函数：将应用结构对象转换为数据库结构对象
 * @param obj 应用结构对象
 * @returns 数据库结构对象
 */
export function toDb<T extends Record<string, any>>(obj: T): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // 如果是数组，递归处理每个元素
    if (Array.isArray(obj)) {
        return obj.map(item => toDb(item));
    }

    // 如果是对象，进行字段名转换
    if (typeof obj === 'object') {
        const result: Record<string, any> = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // 为字段名添加前缀 'c_'
                const newKey = `c_${key}`;
                // 使用 serializer 中的方法深度序列化值
                result[newKey] = deepStringifyValues(obj[key]);
            }
        }
        return result;
    }

    // 基本类型直接返回
    return obj;
}
