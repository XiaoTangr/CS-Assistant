// enums/BizPostType.ts

/**
 * 文章类型枚举
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
    OTHER = 4,
}

/**
 * 文章类型描述映射
 */
export const BizPostTypeDescriptions: Record<BizPostType, string> = {
    [BizPostType.ARTICLE]: '一般文章',
    [BizPostType.VIDEO_CONFIG]: '视频设置',
    [BizPostType.CROSSHAIR_CONFIG]: '准星设置',
    [BizPostType.KEY_BIND]: '键位绑定',
    [BizPostType.OTHER]: '其他',
};

/**
 * 从数字代码获取文章类型
 */
export function getBizPostType(code: number): BizPostType {
    const type = Object.values(BizPostType).find(
        (value) => value === code
    ) as BizPostType | undefined;

    if (type === undefined) {
        throw new Error(`未知的文章类型代码：${code}`);
    }

    return type;
}

/**
 * 获取文章类型的描述
 */
export function getBizPostTypeDescription(type: BizPostType): string {
    return BizPostTypeDescriptions[type] || '未知类型';
}
