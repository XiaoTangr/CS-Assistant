// dto/BizPostDTO.ts

import { BizPostType } from '../enums/BizPostType';
import { PostStatus } from '../types/BizPost';

/**
 * 业务文章数据传输对象
 * 用于接收前端提交的创建/更新请求
 */
export interface BizPostDTO {
    /** 标题（必填） */
    title: string;
    /** 类型（必填） */
    type: BizPostType;
    /** 内容（支持 HTML/MD） */
    content: string;
    /** 
     * 文章状态 
     * 新增时默认为 -1（审核中）或 1（草稿）
     */
    status?: PostStatus;
    /** 置顶权重 越大越重（可选，默认 0） */
    topOrder?: number;
}

/**
 * 创建文章的验证规则
 */
export const createPostValidationRules = {
    title: {
        required: true,
        minLength: 1,
        maxLength: 200,
        message: '标题不能为空且长度不能超过 200 个字符',
    },
    type: {
        required: true,
        message: '请选择文章类型',
    },
    content: {
        required: true,
        minLength: 1,
        message: '内容不能为空',
    },
};
