import { SettingGroupMeta, SettingItem, SettingType } from "../types/Settings";

export const SettingGroups: Record<string, SettingGroupMeta> = {
    test: {
        label: "测试分组",
        order: 1,
    }
}


export const SettingsData: Array<SettingItem> = [
    {
        type: SettingType.TEXT,
        key: "testText",
        label: '测试文本',
        group: SettingGroups.test,
        value: '默认值',
        defaultValue: '默认值',
        placeholder: '请输入内容',
        maxLength: 20,
        order: 1
    }, {
        type: SettingType.SWITCH,
        key: "testSwitch",
        label: '测试开关',
        group: SettingGroups.test,
        value: true,
        defaultValue: true,
        order: 2
    }, {
        type: SettingType.PATH,
        key: "testPath",
        label: '测试路径',
        group: SettingGroups.test,
        value: 'D:\\',
        defaultValue: 'D:\\',
        directoryOnly: true,
        order: 3
    },
    {
        type: SettingType.SELECT,
        key: "testSelect",
        label: '测试选择',
        group: SettingGroups.test,
        value: '1',
        defaultValue: '1',
        order: 4,
        options: [
            {
                value: '1',
                label: '选项1'
            },
            {
                value: '2',
                label: '选项2'
            },
            {
                value: '3',
                label: '选项3'
            }
        ]
    }
]