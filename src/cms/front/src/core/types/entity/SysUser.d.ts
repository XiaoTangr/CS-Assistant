// types/SysUser.ts


/**
 * 系统用户实体
 */
export interface SysUser {
    /** 用户 ID */
    id?: number;
    /** 用户名（登录账号） */
    username: string;
    /** 密码（仅在注册/修改时需要，列表和详情时不返回） */
    password?: string;
    /** 昵称 */
    nickname?: string;
    /** 头像 URL */
    avatar?: string;
    /** 邮箱 */
    email?: string;
    /** Steam 好友 ID */
    steamId?: number;
    /** 用户角色 0=一般用户，1=创作者，2=管理员 */
    role: number;
    /** 是否禁用 false=否，true=是 */
    isDisable?: boolean;
    /** 是否删除 false=否，true=是 */
    isDelete?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
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
    ADMIN = 2,
}

/**
 * 用户角色描述映射
 */
export const UserRoleDescriptions: Record<UserRole, string> = {
    [UserRole.USER]: '普通用户',
    [UserRole.CREATOR]: '创作者',
    [UserRole.ADMIN]: '管理员',
};
