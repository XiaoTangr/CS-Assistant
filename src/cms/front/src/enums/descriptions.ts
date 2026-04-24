
/**
 * 枚举描述信息映射
 * Enum Descriptions
 */

import { BizPostType } from './bizPost'
import { PostStatus, UserRole } from './common'

/**
 * 文章状态描述信息
 */
export const PostStatusDescriptions: Record<PostStatus, string> = {
    [PostStatus.VIOLATION]: '违规',
    [PostStatus.REJECTED]: '驳回',
    [PostStatus.PENDING]: '审核中',
    [PostStatus.PUBLISHED]: '已发布'
}

/**
 * 用户角色描述信息
 */
export const UserRoleDescriptions: Record<UserRole, string> = {
    [UserRole.USER]: '普通用户',
    [UserRole.CREATOR]: '创作者',
    [UserRole.ADMIN]: '管理员'
}

/**
 * 文章类型描述信息
 */
export const BizPostTypeDescriptions: Record<BizPostType, string> = {
    [BizPostType.ARTICLE]: '一般文章',
    [BizPostType.VIDEO_CONFIG]: '视频设置',
    [BizPostType.CROSSHAIR_CONFIG]: '准星设置',
    [BizPostType.KEY_BIND]: '键位绑定',
    [BizPostType.OTHER]: '其他'
}

/**
 * 获取文章状态标签（带颜色标识）
 */
export const PostStatusLabels: Record<PostStatus, { text: string; type: 'success' | 'warning' | 'danger' | 'info' }> = {
    [PostStatus.VIOLATION]: { text: '违规', type: 'danger' },
    [PostStatus.REJECTED]: { text: '驳回', type: 'warning' },
    [PostStatus.PENDING]: { text: '待审', type: 'info' },
    [PostStatus.PUBLISHED]: { text: '公开', type: 'success' }
}
