// dto/SysUserRegisterDTO.ts

/**
 * 系统用户注册数据传输对象
 */
export interface SysUserRegisterDTO {
  /** 用户名（登录账号） */
  username: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  confirmPassword: string;
  /** 昵称 */
  nickname?: string;
  /** 头像 URL */
  avatar?: string;
  /** 邮箱 */
  email?: string;
  /** Steam 好友 ID */
  steamId?: number;
}
