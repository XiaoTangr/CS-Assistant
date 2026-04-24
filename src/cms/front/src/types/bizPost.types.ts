/**
 * 文章相关类型定义
 * Post Type Definitions
 */

import type { BizPostType } from '@/enums/bizPost'
import { PostStatus } from '@/enums/common'
import type { SysUserDTO } from './SysUserDTO'

/**
 * 文章查询参数
 */
export interface bizPostQueryParams {
    page?: number;
    size?: number; //  每页条数（默认 15）
    keyword?: string;//   搜索关键词（标题和内容匹配）
    sort?: "createTime" | "updateTime" | "default";//   排序字段（createTime / updateTime /default，默认 default）
    sortOrder?: "asc" | "desc";//   排序顺序（asc / desc，默认 desc）
    status?: PostStatus;//   文章状态（-3 = 违规，-2 = 驳回，-1 = 审核中，0 = 正常/已发布）
}



/**
 * 业务文章 DTO（基础）
 * 对应后端：BizPostDTO
 */
export interface BizPostDTO {
    /** 文章 ID（新增时不需要，更新时需要） */
    id?: number
    /** 标题（必填） */
    title: string
    /** 类型（必填） */
    type: BizPostType
    /** 内容（支持 HTML/MD） */
    content?: string
    /** 是否为草稿 */
    isDraft?: boolean
    /** 
     * 文章状态
     * -3: 违规，-2: 驳回，-1: 审核中，0: 正常/已发布
     * 新增时默认为 -1（审核中）
     */
    status?: PostStatus | number
    /** 置顶权重（可选，默认 0，越大越靠前） */
    topOrder?: number
    /** 作者 ID（只读） */
    userId?: number
    /** 创建时间（只读） */
    createTime?: string
    /** 更新时间（只读） */
    updateTime?: string
}

/**
 * 业务文章详情 DTO
 * 对应后端：BizPostDetailDTO
 */
export interface BizPostDetailDTO extends BizPostDTO {
    /** 作者信息 */
    author: SysUserDTO
}

/**
 * 分页查询参数
 */
export interface PostQueryParams {
    /** 页码（默认 1） */
    page?: number
    /** 每页条数（默认 10） */
    size?: number
    /** 搜索关键词（匹配标题和内容） */
    keywords?: string
    /** 排序字段 */
    sort?: 'createTime' | 'viewCount' | 'likeCount' | 'topOrder'
    /** 文章类型筛选 */
    type?: BizPostType | number
    /** 文章状态筛选 */
    status?: PostStatus | number
    /** 用户 ID 筛选 */
    userId?: number
}

/**
 * 文章创建请求 DTO
 */
export interface CreatePostRequest extends Omit<BizPostDTO, 'id' | 'userId' | 'createTime' | 'updateTime'> { }

/**
 * 文章更新请求 DTO
 */
export interface UpdatePostRequest extends Partial<Omit<BizPostDTO, 'userId' | 'createTime' | 'updateTime'>> {
    /** 文章 ID（必填） */
    id: number
}
