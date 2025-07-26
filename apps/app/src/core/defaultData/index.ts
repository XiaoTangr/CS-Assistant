import { Map, Settings } from "@/core/models";
export const defaultDatabaseData = [
    {
        tableName: "Settings",
        Structure: [
            { name: "index", type: "number", nullable: false },
            { name: "key", type: "text", nullable: true },
            { name: "text", type: "text", nullable: true },
            { name: "description", type: "text", nullable: true },
            { name: "selected", type: "text", nullable: true },
            { name: "type", type: "text", nullable: true },
            { name: "options", type: "text", nullable: true },
            { name: "groupIndex", type: "number", nullable: true },
            { name: "groupName", type: "text", nullable: true }
        ],
        defaultData:
            [
                {
                    key: "remoteUrlPrefix",
                    text: "数据请求前缀",
                    description: "选择云端数据URL前缀用于加速云端数据获取",
                    selected: "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/",
                    type: "Select",
                    options: [
                        { text: "JsDelivr<推荐>", value: "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/" },
                        { text: "GitHub", value: "https://raw.githubusercontent.com/XiaoTangr/CS2H_Data/refs/heads/main/" },
                        { text: "GitMirror", value: "https://raw.gitmirror.com/XiaoTangr/CS2H_Data/refs/heads/main/" },
                        { text: "gh-proxy", value: "https://gh-proxy.com/raw.githubusercontent.com/XiaoTangr/CS2H_Data/refs/heads/main/" }
                    ],
                    groupIndex: 2,
                    groupName: "网络",
                    index: 1
                },
                {
                    key: "test_input",
                    text: "测试_输入框",
                    description: "描述文本",
                    selected: "的",
                    type: "Input",
                    options: [],
                    groupIndex: 3,
                    groupName: "测试",
                    index: 10
                },
                {
                    key: "cs2InstallPath",
                    text: "CS2安装位置",
                    description: "指定CS2安装位置",
                    selected: "E:/SteamLibrary/steamapps/common/Counter-Strike Global Offensive",
                    type: "PathInput",
                    options: [],
                    groupIndex: 1,
                    groupName: "路径",
                    index: 2
                },
                {
                    key: "test_select",
                    text: "测试_选择框",
                    description: "描述文本",
                    selected: "val1",
                    type: "Select",
                    options: [
                        { text: "测试1", value: "val1" },
                        { text: "测试2", value: "val2" },
                        { text: "测试3", value: "val3" }
                    ],
                    groupIndex: 3,
                    groupName: "测试",
                    index: 3
                },
                {
                    key: "showViewCheck",
                    text: "检查视图兼容性",
                    description: "显示视图兼容性检查遮罩层",
                    selected: "false",
                    type: "Boolean",
                    options: [
                        { text: "启用", value: true },
                        { text: "禁用", value: false }
                    ],
                    groupIndex: 0,
                    groupName: "基本",
                    index: 4
                },
                {
                    key: "steamInstallPath",
                    text: "Steam安装位置",
                    description: "指定Steam在设备上的安装位置",
                    selected: "D:/Program Files (x86)/Steam",
                    type: "PathInput",
                    options: [],
                    groupIndex: 1,
                    groupName: "路径",
                    index: 5
                },
                {
                    key: "devView",
                    text: "开发者工具",
                    description: "启用开发者工具页面",
                    selected: "true",
                    type: "Boolean",
                    options: [
                        { text: "启用", value: true },
                        { text: "禁用", value: false }
                    ],
                    groupIndex: 0,
                    groupName: "基本",
                    index: 6
                },
                {
                    key: "test_fileinput",
                    text: "测试_路径框",
                    description: "描述文本",
                    selected: "D:/Program Files (x86)/Steam",
                    type: "PathInput",
                    options: [],
                    groupIndex: 3,
                    groupName: "测试",
                    index: 7
                },
                {
                    key: "test_boolean",
                    text: "测试_开关",
                    description: "描述文本",
                    selected: "true",
                    type: "Boolean",
                    options: [
                        { text: "启用", value: true },
                        { text: "禁用", value: false }
                    ],
                    groupIndex: 3,
                    groupName: "测试",
                    index: 8
                },
                {
                    key: "backupFolderPath",
                    text: "备份保存位置",
                    description: "选择一个位置来保存备份",
                    selected: "D:/test/bp",
                    type: "PathInput",
                    options: [],
                    groupIndex: 1,
                    groupName: "路径",
                    index: 9
                }
            ] as Settings[]
    }
    , {
        tableName: "Map",
        Structure: [
            { name: "key", type: "text", nullable: false },
            { name: "value", type: "text", nullable: true }
        ],
        defaultData: [
            {
                key: "test",
                value: "test"
            }, {
                key: "test2",
                value: "test2"
            }
        ] as Map[]
    }
]