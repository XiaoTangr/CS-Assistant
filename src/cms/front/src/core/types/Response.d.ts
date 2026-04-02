// types/Response.ts

/**
 * 统一 API 响应体
 */
export interface ResponseBody<T = any> {
    /** 响应码 */
    code: number;
    /** 响应消息 */
    message: string;
    /** 响应数据 */
    data: T;
}

/**
 * 分页数据结构
 */
export interface PageData<T> {
    /** 当前页码 */
    current: number;
    /** 每页条数 */
    size: number;
    /** 总记录数 */
    total: number;
    /** 总页数 */
    pages: number;
    /** 数据列表 */
    records: T[];
}

/**
 * 分页响应体
 */
export interface PageResponseBody<T = any> extends ResponseBody<PageData<T>> { }

/**
 * 常用响应码
 */
export enum ResponseCode {
    /** 成功 */
    SUCCESS = 200,
    /** 参数错误 */
    PARAM_ERROR = 400,
    /** 未授权 */
    UNAUTHORIZED = 401,
    /** 无权限 */
    NO_PERMISSION = 403,
    /** 资源不存在 */
    RESOURCE_NOT_FOUND = 404,
    /** 服务器内部错误 */
    INTERNAL_ERROR = 500,
}

/**
 * 响应码描述映射
 */
export const ResponseCodeDescriptions: Record<number, string> = {
    [ResponseCode.SUCCESS]: '操作成功',
    [ResponseCode.PARAM_ERROR]: '参数错误',
    [ResponseCode.UNAUTHORIZED]: '未授权',
    [ResponseCode.NO_PERMISSION]: '无权限',
    [ResponseCode.RESOURCE_NOT_FOUND]: '资源不存在',
    [ResponseCode.INTERNAL_ERROR]: '服务器内部错误',
};
