/**
 * 通用枚举定义
 * Common Enumerations
 */

/**
 * 文章状态枚举
 * -3: 违规，-2: 驳回，-1: 审核中，0: 正常/已发布
 */
export enum PostStatus {
    /** 违规 */
    VIOLATION = -3,
    /** 驳回 */
    REJECTED = -2,
    /** 审核中 */
    PENDING = -1,
    /** 正常/已发布 */
    PUBLISHED = 0
}

/**
 * 用户角色枚举
 */
export enum UserRole {
    /** 普通用户 */
    USER = 0,
    /** 创作者 */
    CREATOR = 1,
    /** 管理员 */
    ADMIN = 2
}

/**
 * 排序方向枚举
 */
export enum SortOrder {
    /** 升序 */
    ASC = 'asc',
    /** 降序 */
    DESC = 'desc'
}

/**
 * 是否枚举（布尔值的数字表示）
 */
export enum YesNo {
    /** 否 */
    NO = 0,
    /** 是 */
    YES = 1
}
