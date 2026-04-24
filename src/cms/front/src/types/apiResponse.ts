/**
 * API 通用类型定义
 * API Type Definitions
 */

/**
 * API 统一响应结构
 * 对应后端：ResponseBody
 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success?: boolean
  /** 响应数据 */
  data?: T
}

/**
 * 分页结果对象
 * 对应后端 MyBatis-Plus Page 对象
 */
export interface PageResult<T> {
  /** 当前页数据 */
  records: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  current: number
  /** 每页条数 */
  size: number
  /** 总页数（计算得出） */
  pages?: number
}

/**
 * 分页查询基础参数
 */
export interface PageQueryParams {
  /** 页码（默认 1） */
  page?: number
  /** 每页条数（默认 10） */
  size?: number
}

/**
 * 上传文件响应
 */
export interface UploadResponse {
  /** 文件 URL */
  url: string
  /** 文件名 */
  filename: string
  /** 文件大小（字节） */
  size: number
}
