export interface Settings {
    index: number | null;
    key: string | null;
    text: string | null;
    description: string | null;
    type: "Input" | "Boolean" | "Select" | "PathInput" | string | null;
    selected: string | boolean | null;
    options: Array<SettingsRowOptions> | null;
    groupName: string | null;
    groupIndex: number | null;
}
export interface SettingsRowOptions {
    /**
     * @description 选项的值，用于存储和比较
     */
    value: string;

    /**
     * @description 选项的显示文本，用于在界面上显示给用户
     */
    text: string;
}
export type SettingsGroup = Record<string, Settings[]>;