import { t_Map, t_Settings, t_BackupAndRecovery } from "@/core/database/models";
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
        defaultData: [
            {
                "c_index": 1,
                "c_key": "remoteUrlPrefix",
                "c_text": "数据请求前缀",
                "c_description": "选择云端数据URL前缀用于加速云端数据获取",
                "c_selected": "https://cdn.jsdelivr.net/gh/${username}/${reponame}@${branchname}/",
                "c_type": "Select",
                "c_options": "[{\"text\":\"JsDelivr<推荐>\",\"value\":\"https://cdn.jsdelivr.net/gh/${username}/${reponame}@${branchname}/\"},{\"text\":\"GitHub\",\"value\":\"https://raw.githubusercontent.com/${username}/${reponame}/refs/heads/${branchname}/\"},{\"text\":\"GitMirror\",\"value\":\"https://hub.gitmirror.com/raw.githubusercontent.com/${username}/${reponame}/refs/heads/${branchname}/\"},{\"text\":\"gh-proxy\",\"value\":\"https://gh-proxy.com/raw.githubusercontent.com/${username}/${reponame}/refs/heads/${branchname}/\"}]",
                "c_groupIndex": 2,
                "c_groupName": "网络"
            },
            {
                "c_index": 2,
                "c_key": "steamInstallPath",
                "c_text": "Steam安装位置",
                "c_description": "指定Steam在设备上的安装位置",
                "c_selected": "",
                "c_type": "PathInput",
                "c_options": "[]",
                "c_groupIndex": 1,
                "c_groupName": "路径"
            },
            {
                "c_index": 3,
                "c_key": "cs2InstallPath",
                "c_text": "CS2安装位置",
                "c_description": "指定CS2安装位置",
                "c_selected": "",
                "c_type": "PathInput",
                "c_options": "[]",
                "c_groupIndex": 1,
                "c_groupName": "路径"
            },
            {
                "c_index": 4,
                "c_key": "showViewCheck",
                "c_text": "检查视图兼容性",
                "c_description": "显示视图兼容性检查遮罩层",
                "c_selected": "true",
                "c_type": "Boolean",
                "c_options": "[{\"text\":\"启用\",\"value\":\"true\"},{\"text\":\"禁用\",\"value\":\"false\"}]",
                "c_groupIndex": 4,
                "c_groupName": "高级"
            },
            {
                "c_index": 6,
                "c_key": "devMode",
                "c_text": "开发者模式",
                "c_description": "<重启生效> 启用开发者模式。该模式提供破坏性功能，正常使用请勿开启",
                "c_selected": "false",
                "c_type": "Boolean",
                "c_options": "[{\"text\":\"启用\",\"value\":\"true\"},{\"text\":\"禁用\",\"value\":\"false\"}]",
                "c_groupIndex": 4,
                "c_groupName": "高级"
            },
            {
                "c_index": 9,
                "c_key": "backupFolderPath",
                "c_text": "备份保存位置",
                "c_description": "选择一个位置来保存备份",
                "c_selected": "C:\\cs-Assistant\\BackUp\\",
                "c_type": "PathInput",
                "c_options": "[]",
                "c_groupIndex": 1,
                "c_groupName": "路径"
            },
            {
                "c_index": 12,
                "c_key": "defaultLogLevel",
                "c_text": "默认日志级别",
                "c_description": "<重启生效> 设置控制台日志以及日志文件的记录级别",
                "c_selected": "0.0",
                "c_type": "Select",
                "c_options": "[{\"text\":\"0: 信息，日志，警告，错误和调试\",\"value\":0},{\"text\":\"1: 日志，警告，错误和调试\",\"value\":1},{\"text\":\"2: 警告，错误和调试\",\"value\":2},{\"text\":\"3: 错误和调试\",\"value\":3}]",
                "c_groupIndex": 4,
                "c_groupName": "高级"
            },
            {
                "c_index": 13,
                "c_key": "showUpdateDialog",
                "c_text": "显示更新提示",
                "c_description": "当有更新可用时弹出提示",
                "c_selected": "true",
                "c_type": "Boolean",
                "c_options": "[{\"text\":\"启用\",\"value\":\"true\"},{\"text\":\"禁用\",\"value\":\"false\"}]",
                "c_groupIndex": 0,
                "c_groupName": "基本"
            },
            {
                "c_index": 14,
                "c_key": "getDevVersion",
                "c_text": "使用测试版",
                "c_description": "接收测试版更新提醒",
                "c_selected": "false",
                "c_type": "Boolean",
                "c_options": "[{\"text\":\"启用\",\"value\":\"true\"},{\"text\":\"禁用\",\"value\":\"false\"}]",
                "c_groupIndex": 4,
                "c_groupName": "高级"
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
                "c_key": "DB_Version",
                "c_value": "1.0.0"
            },
            {
                "c_key": "App_Github",
                "c_value": "https://github.com/XiaoTangr/CS-Assistant"
            }
        ] as t_Map[]
    }, {
        tableName: "t_BackupAndRecovery",
        Structure: [
            { name: "c_id", type: "number", nullable: false },
            { name: "c_nickName", type: "text", nullable: false },
            { name: "c_friendId", type: "text", nullable: false },
            { name: "c_description", type: "text", nullable: true },
            { name: "c_createdAt", type: "text", nullable: false },
            { name: "c_folderPath", type: "text", nullable: false }
        ],
        defaultData: [] as t_BackupAndRecovery[]
    }
]
export const updateDatabaseData = {
    needAppVersion: '1.0.1',
    setDBVersion: '1.2.0',
    payloads: [{
        tableName: 't_Settings',
        updateData: []
    },
    {
        tableName: 't_Map',
        // 以第一个键值对作为filter
        updateData: [{
            c_key: 'DB_Version',
            c_value: '1.2.0'
        }] as t_Map[],
    }],
    dropPayloads: [
        {
            tableName: 't_Map',
            dropData: [{
                c_key: 'test_update',
            }]
        }
    ],
};
