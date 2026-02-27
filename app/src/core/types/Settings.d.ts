import { SETTINGS_TYPE } from "../config/settings-config";

// ---------------- 类型声明 ---------------------
export type ConfigItem = TextConfig | SelectConfig | SwitchConfig | PathConfig;

/**
 * 设置项基本字段
 */
export interface BaseConfig {
    /** 排序权重（数值越小越靠前） */
    order: number;
    /** 设置项唯一标识（只读） */
    readonly key: string;
    /** 设置项显示标签 */
    label: string;
    /** 设置项描述说明（可选） */
    description?: string;
}


/**
 * 文本输入配置项
 * 字符串输入类设置项的专属属性
 */
interface TextConfig extends BaseConfig {
    /** 固定为文本输入类型 */
    kind: SETTINGS_TYPE.TEXT;
    /** 默认值 */
    defaultValue: string;
    /** 输入框占位符（可选） */
    placeholder?: string;
    /** 最大输入长度（可选） */
    maxLength?: number;
}

/**
 * 开关配置项
 * 布尔值切换类设置项的专属属性
 */
interface SwitchConfig extends BaseConfig {
    /** 固定为开关类型 */
    kind: SETTINGS_TYPE.SWITCH;
    /** 默认值 */
    defaultValue: boolean;
}

/**
 * 路径选择配置项
 * 文件/目录路径选择类设置项的专属属性
 */
interface PathConfig extends BaseConfig {
    /** 固定为路径选择类型 */
    kind: SETTINGS_TYPE.PATH;
    /** 默认值 */
    defaultValue: string;
    /** 是否仅允许选择目录（可选） */
    directoryOnly?: boolean;
    /** 允许的文件扩展名列表（可选，如 ['json', 'txt']） */
    fileExtensions?: string[];
}

/**
 * 下拉选择配置项
 * 下拉选择类设置项的专属属性
 */
interface SelectConfig extends BaseConfig {
    /** 固定为下拉选择类型 */
    kind: SETTINGS_TYPE.SELECT;
    /** 默认值 */
    defaultValue: string;
    /** 可选列表 */
    options: OptionItem[];
}

/**
 * 下拉选项配置
 * 用于 SELECT 类型设置项的选项定义
 */
interface OptionItem {
    /** 选项值 */
    value: string;
    /** 选项显示文本 */
    label: string;
    /** 是否禁用选项（可选） */
    disabled?: boolean;
}

// 设置数据
// export type configData = Record<Partial<keyof typeof groups>, SettingConfig[]>
export type configData = Partial<Record<keyof typeof groups, ConfigItem[]>>
