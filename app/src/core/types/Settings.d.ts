/**
 * 应用程序设置类型定义
 * 包含所有设置项的类型定义和相关接口
 * @packageDocumentation
 */


/**
 * 设置项类型枚举
 * 用于区分不同交互类型的设置项
 */
export enum SettingType {
    /** 文本输入类型 */
    TEXT = 'text',
    /** 下拉选择类型 */
    SELECT = 'select',
    /** 开关切换类型 */
    SWITCH = 'switch',
    /** 文件/目录路径选择类型 */
    PATH = 'path'
}

/**
 * 设置分组元信息
 * 用于定义分组的基础属性（排序、名称）
 */
export interface SettingGroupMeta {
    /** 分组显示名称 */
    label: string;
    /** 分组排序权重（数值越小越靠前） */
    order: number;
}

/**
 * 基础设置项配置
 * 所有设置项的通用核心属性
 */
export interface SettingConfig {
    /** 排序权重（数值越小越靠前，可选） */
    order: number;
    /** 设置项唯一标识（只读） */
    readonly key: string;
    /** 设置项显示名称 */
    label: string;
    /** 设置项描述说明（可选） */
    description?: string;
    /** 设置项交互类型 */
    type: SettingType;
    /** 所属分组元信息 */
    group: SettingGroupMeta;
}

/**
 * 下拉选项配置
 * 用于 SELECT 类型设置项的选项定义
 */
export interface SelectItem {
    /** 选项值 */
    value: string;
    /** 选项显示文本 */
    label: string;
    /** 是否禁用选项（可选） */
    disabled?: boolean;
}

/**
 * 文本输入配置项
 * 字符串输入类设置项的专属属性
 */
export interface TextConfig extends SettingConfig {
    /** 固定为文本输入类型 */
    type: SettingType.TEXT;
    /** 当前值 */
    value: string;
    /** 默认值 */
    defaultValue: string;
    /** 输入框占位符（可选） */
    placeholder?: string;
    /** 最大输入长度（可选） */
    maxLength?: number;
}

/**
 * 下拉选择配置项
 * 下拉选择类设置项的专属属性
 */
export interface SelectConfig extends SettingConfig {
    /** 固定为下拉选择类型 */
    type: SettingType.SELECT;
    /** 当前值 */
    value: string;
    /** 默认值 */
    defaultValue: string;
    /** 可选列表 */
    options: SelectItem[];
}

/**
 * 开关配置项
 * 布尔值切换类设置项的专属属性
 */
export interface SwitchConfig extends SettingConfig {
    /** 固定为开关类型 */
    type: SettingType.SWITCH;
    /** 当前值 */
    value: boolean;
    /** 默认值 */
    defaultValue: boolean;
}

/**
 * 路径选择配置项
 * 文件/目录路径选择类设置项的专属属性
 */
export interface PathConfig extends SettingConfig {
    /** 固定为路径选择类型 */
    type: SettingType.PATH;
    /** 当前值 */
    value: string;
    /** 默认值 */
    defaultValue: string;
    /** 是否仅允许选择目录（可选） */
    directoryOnly?: boolean;
    /** 允许的文件扩展名列表（可选，如 ['json', 'txt']） */
    fileExtensions?: string[];
}

/**
 * 所有设置项配置的联合类型
 * 涵盖所有交互类型的设置项
 */
export type SettingItem = TextConfig | SelectConfig | SwitchConfig | PathConfig;

/**
 * 设置分组配置
 * 用于组织设置项的分组整体配置（含标识、图标等）
 */
export interface SettingGroupConfig {
    /** 分组唯一标识 */
    id: string;
    /** 分组显示名称 */
    label: string;
    /** 分组图标（可选，如图标组件名称/路径） */
    icon?: string;
    /** 分组描述说明（可选） */
    description?: string;
}