// types/BizPost.ts

import { BizPostType } from '../enums/BizPostType';

/**
 * 文章状态枚举
 */
export enum PostStatus {
    /** 违规 */
    VIOLATION = -2,
    /** 审核中 */
    PENDING_REVIEW = -1,
    /** 正常 */
    NORMAL = 0,
    /** 草稿 */
    DRAFT = 1,
}

/**
 * 文章状态描述映射
 */
export const PostStatusDescriptions: Record<PostStatus, string> = {
    [PostStatus.VIOLATION]: '违规',
    [PostStatus.PENDING_REVIEW]: '审核中',
    [PostStatus.NORMAL]: '正常',
    [PostStatus.DRAFT]: '草稿',
};

/**
 * 业务文章实体
 */
export interface BizPost {
    /** 主键 ID */
    id?: number;
    /** 用户 ID，关联 sys_user.id */
    userId?: number;
    /** 标题 */
    title: string;
    /** 类型 */
    type: BizPostType;
    /** 内容（支持 HTML/MD） */
    content: string;
    /** 文章状态 */
    status?: PostStatus;
    /** 是否删除 false=否，true=是 */
    isDelete?: boolean;
    /** 置顶权重 越大越重 */
    topOrder?: number;
    /** 创建时间 */
    createTime?: string;
    /** 最后更新时间 */
    updateTime?: string;
    /** 作者信息（可选，关联查询时返回） */
    author?: {
        id: number;
        username: string;
        nickname?: string;
        avatar?: string;
    };
}
