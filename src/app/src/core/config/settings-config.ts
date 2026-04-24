
import { configData, ConfigItem } from "../types/settings";

export enum SETTINGS_GROUP {
    "通用" = 0,
    "功能" = 1,
    "其他" = 2
};
export enum SETTINGS_TYPE {
    PATH = 'path',
    SELECT = 'select',
    SWITCH = 'switch',
    TEXT = 'text'
}
export const SETTINGS_DATA: configData = {
    "其他": [{
        order: 0,
        key: "auto_update",
        label: "自动更新",
        kind: SETTINGS_TYPE.PATH,
        description: "是否自动更新",
        defaultValue: "true"
    }, {
        order: 1,
        key: "auto_update_interval",
        label: "自动更新间隔",
        kind: SETTINGS_TYPE.TEXT,
        description: "自动更新间隔（单位：小时）",
        defaultValue: "24"
    }],
    "通用": [{
        order: 0,
        key: "auto_update",
        label: "自动更新",
        kind: SETTINGS_TYPE.PATH,
        description: "是否自动更新",
        defaultValue: "true"
    }, {
        order: 1,
        key: "auto_update_interval",
        label: "自动更新间隔",
        kind: SETTINGS_TYPE.TEXT,
        description: "自动更新间隔（单位：小时）",
        defaultValue: "24"
    }],
    "功能": [{
        order: 1,
        key: "auto_update_interval",
        label: "自动更新间隔",
        kind: SETTINGS_TYPE.TEXT,
        description: "自动更新间隔（单位：小时）",
        defaultValue: "24"
    }]
};

export const getSettingsItemsAsArray = (): ConfigItem[] => {
    return Object.entries(SETTINGS_DATA).flatMap(([_, items]) => items || []);
};