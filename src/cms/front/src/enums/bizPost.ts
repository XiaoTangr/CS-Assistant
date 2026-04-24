
/**
 * 文章相关枚举定义
 * Post Enumerations
 */

/**
 * 文章类型枚举
 * 对应后端：cn.javat.csa.cms.common.enums.BizPostType
 */
export enum BizPostType {
    /** 一般文章 */
    ARTICLE = 0,
    /** 视频设置 */
    VIDEO_CONFIG = 1,
    /** 准星设置 */
    CROSSHAIR_CONFIG = 2,
    /** 键位绑定 */
    KEY_BIND = 3,
    /** 其他 */
    OTHER = 4
}
