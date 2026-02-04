import { AppConfig, AppConfigGroup } from "../models";

export const configGroups: AppConfigGroup[] = [
    {
        groupId: 0,
        name: "基本"
    },
    {
        groupId: 1,
        name: "路径"
    },
    {
        groupId: 2,
        name: "网络"
    },
    {
        groupId: 4,
        name: "高级"
    }
];

export const appConfigs: AppConfig[] = [
    {
        key: "remoteUrlPrefix",
        value: "https://cdn.jsdelivr.net/gh/${username}/${reponame}@${branchname}",
        title: "数据请求前缀",
        description: "选择云端数据URL前缀用于加速云端数据获取",
        type: "Select",
        options: [
            { order: 0, "label": "JsDelivr<推荐>", "value": "https://cdn.jsdelivr.net/gh/${username}/${reponame}@${branchname}" },
            { order: 1, "label": "GitHub", "value": "https://raw.githubusercontent.com/${username}/${reponame}/refs/heads/${branchname}" },
            { order: 2, "label": "GitMirror", "value": "https://hub.gitmirror.com/raw.githubusercontent.com/${username}/${reponame}/refs/heads/${branchname}" },
            { order: 3, "label": "gh-proxy", "value": "https://gh-proxy.com/raw.githubusercontent.com/${username}/${reponame}/refs/heads/${branchname}" },
            { order: 4, "label": "GitPages", "value": "https://github.javat.cn/CS-Assistant" }
        ],
        order: 1,
        groupId: 2
    },
    {
        key: "steamInstallPath",
        value: "D:\\Program Files (x86)\\Steam",
        title: "Steam安装位置",
        description: "指定Steam在设备上的安装位置",
        type: "PathInput",
        options: [],
        order: 2,
        groupId: 1
    },
    {
        key: "cs2InstallPath",
        value: "E:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive",
        title: "CS2安装位置",
        description: "指定CS2安装位置",
        type: "PathInput",
        options: [],
        order: 3,
        groupId: 1
    },
    {
        key: "showViewCheck",
        value: true,
        title: "检查视图兼容性",
        description: "显示视图兼容性检查遮罩层",
        type: "Boolean",
        options: {
            true: "启用",
            false: "禁用"
        },
        order: 4,
        groupId: 4
    },
    {
        key: "devMode",
        value: true,
        title: "开发者模式",
        description: "<重启生效> 启用开发者模式。该模式提供破坏性功能，正常使用请勿开启",
        type: "Boolean",
        options: {
            true: "启用",
            false: "禁用"
        },
        order: 5,
        groupId: 4
    },
    {
        key: "backupFolderPath",
        value: "E:\\cs-Assistant\\BackUp\\",
        title: "备份保存位置",
        description: "选择一个位置来保存备份",
        type: "PathInput",
        options: [],
        order: 6,
        groupId: 1
    },
    {
        key: "defaultLogLevel",
        value: 0,
        title: "默认日志级别",
        description: "<重启生效> 设置控制台日志以及日志文件的记录级别",
        type: "Select",
        options: [
            { "label": "0: 信息，日志，警告，错误和调试", "value": 0 },
            { "label": "1: 日志，警告，错误和调试", "value": 1 },
            { "label": "2: 警告，错误和调试", "value": 2 },
            { "label": "3: 错误和调试", "value": 3 }
        ],
        order: 7,
        groupId: 4
    },
    {
        key: "showUpdateDialog",
        value: true,
        title: "显示更新提示",
        description: "当有更新可用时弹出提示",
        type: "Boolean",
        options: {
            true: "启用",
            false: "禁用"
        },
        order: 8,
        groupId: 0
    },
    {
        key: "getDevVersion",
        value: false,
        title: "使用测试版",
        description: "接收测试版更新提醒",
        type: "Boolean",
        options: {
            true: "启用",
            false: "禁用"
        },
        order: 9,
        groupId: 4
    }
];
