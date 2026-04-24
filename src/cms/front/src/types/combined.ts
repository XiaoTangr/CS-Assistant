import type { BizPostType } from "@/enums/bizPost"
import type { PostStatus } from "@/enums/common"



/**
 * 文章高级筛选条件
 */
export interface PostFilterOptions {
    /** 类型筛选 */
    types?: BizPostType[]
    /** 状态筛选 */
    statuses?: PostStatus[]
    /** 日期范围开始 */
    dateFrom?: string
    /** 日期范围结束 */
    dateTo?: string
    /** 最小浏览量 */
    minViews?: number
    /** 最小点赞数 */
    minLikes?: number
}

/**
 * 文章列表完整查询参数
 */
export interface PostListQuery extends PostFilterOptions {
    /** 页码 */
    page?: number
    /** 每页条数 */
    size?: number
    /** 搜索关键词 */
    keywords?: string
}
