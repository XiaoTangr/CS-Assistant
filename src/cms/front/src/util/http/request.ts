
// 定义通用响应结构
// 所有方法永远返回此结构
// 例如get<T>('/api/users/current') 中的T 表明data的类型
export interface HttpResponse<T = any> {
    code: number
    data: T
    message: string
}

// 定义请求配置
export interface RequestConfig extends RequestInit {
    withToken?: boolean,
}

class HttpRequest {
    private baseURL: string
    private defaultTimeout: number

    constructor() {
        this.baseURL = import.meta.env.VITE_APP_BASE_API || ''
        this.defaultTimeout = 10000
    }

    // 构建完整的 URL
    private buildURL(url: string): string {
        return `${this.baseURL}${url}`
    }

    // 将对象转换为查询字符串
    private buildQueryString(params?: Record<string, any>): string {
        if (!params || typeof params !== 'object') {
            return ''
        }

        const queryString = Object.entries(params)
            .filter(([_, value]) => value !== null && value !== undefined)
            .map(([key, value]) => {
                // 如果值是数组，每个元素都作为一个单独的参数
                if (Array.isArray(value)) {
                    return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&')
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            })
            .filter(Boolean)
            .join('&')

        return queryString ? `?${queryString}` : ''
    }

    // 构建请求头
    private buildHeaders(config?: RequestConfig): Headers {
        const headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            ...config?.headers,
        })

        // 添加认证 token
        if (config?.withToken !== false) {
            const token = localStorage.getItem('token')
            // token 不存在或者为空时
            if (!token || token === '') {
                localStorage.removeItem('token')
                throw new Error('请先登录!')
            }
            headers.set('Authorization', token)
        }

        return headers
    }

    // 处理响应
    private async handleResponse<T>(response: Response): Promise<HttpResponse<T>> {
        const headers = response.headers

        // 处理响应头中的 Authorization
        const authorization = headers.get('authorization')
        if (authorization) {
            localStorage.removeItem('token')
            // 以`Bearer {jwt}` 保存
            const token = authorization.startsWith('Bearer ') ?
                authorization :
                `Bearer ${authorization}`
            localStorage.setItem('token', token)
        }

        // 解析响应数据
        const responseData = await response.json() as HttpResponse<T>
        const { data, message, code } = responseData

        // 根据状态码进行不同处理
        if (response.ok) {
            return responseData
        } else {
            throw new Error(message || 'Error')
        }
    }

    // 执行请求
    private async executeRequest<T>(
        url: string,
        method: string,
        data?: any,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        const fullURL = this.buildURL(url)
        const headers = this.buildHeaders(config)

        // 创建 AbortController 用于超时控制
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout)

        const fetchConfig: RequestInit = {
            method,
            headers,
            signal: controller.signal,
            ...config,
        }

        // 如果有请求体且不是 GET/HEAD 请求，添加 body
        if (data && method !== 'GET' && method !== 'HEAD') {
            fetchConfig.body = JSON.stringify(data)
        }

        try {
            const response = await fetch(fullURL, fetchConfig)
            clearTimeout(timeoutId)
            return await this.handleResponse<T>(response)
        } catch (error) {
            clearTimeout(timeoutId)
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.error('请求超时:', error)
                throw new Error('请求超时')
            }
            console.error('请求错误:', error)
            throw error
        }
    }

    // GET 请求
    public async get<T = any>(
        url: string,
        queryParams?: Record<string, any> | null,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        // 构建带查询参数的完整 URL
        const queryString = this.buildQueryString(queryParams || undefined)
        const fullURL = `${this.buildURL(url)}${queryString}`

        return this.executeRequest<T>(fullURL, 'GET', undefined, config)
    }

    // POST 请求
    public async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.executeRequest<T>(url, 'POST', data, config)
    }

    // PUT 请求
    public async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.executeRequest<T>(url, 'PUT', data, config)
    }

    // DELETE 请求
    public async delete<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.executeRequest<T>(url, 'DELETE', undefined, config)
    }

    // PATCH 请求
    public async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.executeRequest<T>(url, 'PATCH', data, config)
    }
}

// 默认导出实例
const http = new HttpRequest()
export default http
