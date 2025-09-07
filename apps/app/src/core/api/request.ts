import { fetch } from "@tauri-apps/plugin-http";
import { LogService } from "../services";
import { json5 } from "../utils";
import { ApiResponse, RequestConfig } from "../models";

// 默认请求头
const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'CS-Assistant/1.0'
};

// 基础请求方法，带有适当的类型约束
export const request = async <T extends Record<string, unknown> | unknown[], B = Record<string, unknown>>(
    url: string,
    config: RequestConfig<B> = {}
): Promise<ApiResponse<T>> => {
    try {
        const { method = 'GET', headers, body, timeout = 10000 } = config;
        LogService.info(
            `[Network Request]
            Url:${url}
            Congif:${json5.stringify(config)}
            `)
        const response = await fetch(url, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(timeout)
        });
        const responseText = await response.text();
        // 明确类型转换，确保响应数据符合预期类型
        const responseData = json5.deepParse(responseText) as T ?? null;

        const result: ApiResponse<T> = {
            data: responseData,
            code: response.status,
            success: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            message: response.ok
                ? undefined
                : `请求失败，状态码 ${response.status}: ${response.statusText}`
        };

        if (!response.ok) {
            LogService.error(`[baseFetch@Network Request]: ${result.message}`);
        }

        return result;
    } catch (error: any) {
        const errorMessage = error;
        LogService.error(`[baseFetch@Network Request]: ${error}`);

        return {
            data: null,
            headers: {},
            code: 500,
            message: errorMessage,
            success: false,
        };
    }
};

// GET 请求（更完善的类型定义）
export const get = async <T extends Record<string, unknown> | Array<unknown>>(
    url: string,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> => {
    return request<T>(url, { ...config, method: 'GET' });
};

// POST 请求（更完善的类型定义）
export const post = async <T extends Record<string, unknown> | Array<unknown>, B = Record<string, unknown>>(
    url: string,
    body?: B,
    config: Omit<RequestConfig<B>, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> => {
    return request<T, B>(url, { ...config, method: 'POST', body });
};

// PUT 请求（更完善的类型定义）
export const put = async <T extends Record<string, unknown> | Array<unknown>, B = Record<string, unknown>>(
    url: string,
    body?: B,
    config: Omit<RequestConfig<B>, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> => {
    return request<T, B>(url, { ...config, method: 'PUT', body });
};

// DELETE 请求（更完善的类型定义）
export const del = async <T extends Record<string, unknown> | Array<unknown>>(
    url: string,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> => {
    return request<T>(url, { ...config, method: 'DELETE' });
};
