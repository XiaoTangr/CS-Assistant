import { t_Map, t_Settings } from "@/core/database/models";
export const defaultDatabaseData = [
    {
        tableName: "t_Settings",
        Structure: [
            { name: "c_index", type: "number", nullable: false },
            { name: "c_key", type: "text", nullable: true },
            { name: "c_text", type: "text", nullable: true },
            { name: "c_description", type: "text", nullable: true },
            { name: "c_selected", type: "text", nullable: true },
            { name: "c_type", type: "text", nullable: true },
            { name: "c_options", type: "text", nullable: true },
            { name: "c_groupIndex", type: "number", nullable: true },
            { name: "c_groupName", type: "text", nullable: true }
        ],
        defaultData:
            [
                {
                    c_key: "remoteUrlPrefix",
                    c_text: "数据请求前缀",
                    c_description: "选择云端数据URL前缀用于加速云端数据获取",
                    c_selected: "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/",
                    c_type: "Select",
                    c_options: [
                        { text: "JsDelivr<推荐>", value: "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/" },
                        { text: "GitHub", value: "https://raw.githubusercontent.com/XiaoTangr/CS2H_Data/refs/heads/main/" },
                        { text: "GitMirror", value: "https://raw.gitmirror.com/XiaoTangr/CS2H_Data/refs/heads/main/" },
                        { text: "gh-proxy", value: "https://gh-proxy.com/raw.githubusercontent.com/XiaoTangr/CS2H_Data/refs/heads/main/" }
                    ],
                    c_groupIndex: 2,
                    c_groupName: "网络",
                    c_index: 1
                },
                {
                    c_key: "test_input",
                    c_text: "测试_输入框",
                    c_description: "描述文本",
                    c_selected: "的",
                    c_type: "Input",
                    c_options: [],
                    c_groupIndex: 3,
                    c_groupName: "测试",
                    c_index: 10
                },
                {
                    c_key: "cs2InstallPath",
                    c_text: "CS2安装位置",
                    c_description: "指定CS2安装位置",
                    c_selected: "E:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive",
                    c_type: "PathInput",
                    c_options: [],
                    c_groupIndex: 1,
                    c_groupName: "路径",
                    c_index: 2
                },
                {
                    c_key: "test_select",
                    c_text: "测试_选择框",
                    c_description: "描述文本",
                    c_selected: "val1",
                    c_type: "Select",
                    c_options: [
                        { text: "测试1", value: "val1" },
                        { text: "测试2", value: "val2" },
                        { text: "测试3", value: "val3" }
                    ],
                    c_groupIndex: 3,
                    c_groupName: "测试",
                    c_index: 3
                },
                {
                    c_key: "showViewCheck",
                    c_text: "检查视图兼容性",
                    c_description: "显示视图兼容性检查遮罩层",
                    c_selected: "false",
                    c_type: "Boolean",
                    c_options: [
                        { text: "启用", value: true },
                        { text: "禁用", value: false }
                    ],
                    c_groupIndex: 0,
                    c_groupName: "基本",
                    c_index: 4
                },
                {
                    c_key: "steamInstallPath",
                    c_text: "Steam安装位置",
                    c_description: "指定Steam在设备上的安装位置",
                    c_selected: "D:/Program Files (x86)/Steam",
                    c_type: "PathInput",
                    c_options: [],
                    c_groupIndex: 1,
                    c_groupName: "路径",
                    c_index: 5
                },
                {
                    c_key: "devView",
                    c_text: "开发者工具",
                    c_description: "启用开发者工具页面",
                    c_selected: "true",
                    c_type: "Boolean",
                    c_options: [
                        { text: "启用", value: true },
                        { text: "禁用", value: false }
                    ],
                    c_groupIndex: 0,
                    c_groupName: "基本",
                    c_index: 6
                },
                {
                    c_key: "test_fileinput",
                    c_text: "测试_路径框",
                    c_description: "描述文本",
                    c_selected: "D:/Program Files (x86)/Steam",
                    c_type: "PathInput",
                    c_options: [],
                    c_groupIndex: 3,
                    c_groupName: "测试",
                    c_index: 7
                },
                {
                    c_key: "test_boolean",
                    c_text: "测试_开关",
                    c_description: "描述文本",
                    c_selected: "true",
                    c_type: "Boolean",
                    c_options: [
                        { text: "启用", value: true },
                        { text: "禁用", value: false }
                    ],
                    c_groupIndex: 3,
                    c_groupName: "测试",
                    c_index: 8
                },
                {
                    c_key: "backupFolderPath",
                    c_text: "备份保存位置",
                    c_description: "选择一个位置来保存备份",
                    c_selected: "D:/test/bp",
                    c_type: "PathInput",
                    c_options: [],
                    c_groupIndex: 1,
                    c_groupName: "路径",
                    c_index: 9
                }
            ] as t_Settings[]
    },
    {
        tableName: "t_Map",
        Structure: [
            { name: "c_key", type: "text", nullable: false },
            { name: "c_value", type: "text", nullable: true }
        ],
        defaultData: [
            {
                c_key: "test",
                c_value: "test"
            }, {
                c_key: "test2",
                c_value: "test2"
            }
        ] as t_Map[]
    }
]