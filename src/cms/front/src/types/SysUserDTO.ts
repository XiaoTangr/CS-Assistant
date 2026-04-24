/**
 * 用户相关类型定义
 * User Type Definitions
 */

import { UserRole } from '@/enums/common'

/**
 * 用户信息 DTO
 * 对应后端：SysUserDTO
 */
export interface SysUserDTO {
    /** 用户 ID */
    id?: number
    /** 用户名 */
    username?: string
    /** 昵称 */
    nickname?: string
    /** 头像 URL */
    avatar?: string
    /** 邮箱 */
    email?: string
    /** Steam ID */
    steamId?: number
    /** 角色代码 */
    role?: UserRole
    /** 是否禁用 */
    isDisable?: boolean
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 用户注册请求 DTO
 */
export interface UserRegisterDTO {
    /** 用户名 */
    username: string
    /** 密码 */
    password: string
    /** 确认密码 */
    confirmPassword?: string
    /** 昵称（可选） */
    nickname?: string
    /** 邮箱（可选） */
    email?: string
    /** 头像 URL */
    avatar?: string
}

/**
 * 用户登录请求 DTO
 */
export interface UserLoginDTO {
    /** 用户名或邮箱 */
    username: string
    /** 密码 */
    password: string
}

/**
 * 登录响应 DTO
 */
export interface LoginResponseDTO {
    /** JWT Token */
    token: string
    /** 用户信息 */
    user: SysUserDTO
}

/**
 * 更新用户信息请求 DTO
 */
export interface UpdateUserDTO {
    /** 昵称 */
    nickname?: string
    /** 头像 URL */
    avatar?: string
    /** 邮箱 */
    email?: string
}
