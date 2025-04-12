
export const SQLs = [
    {
        tableName: "Settings",
        createSql: `
            CREATE TABLE IF NOT EXISTS Settings (
	            "key" TEXT NOT NULL PRIMARY KEY,
	            "text" TEXT,
	            "description" TEXT,
                "type" TEXT,
                "selected" TEXT,
                "options" TEXT,
                "chapter" TEXT, 
                "section" TEXT
            );
        `,
        defaultData: [{ "key": "showViewCheck", "text": "检查视图兼容性", "description": "显示视图兼容性检查遮罩层", "type": "Boolean", "selected": true, "options": [{ "text": "启用", "value": true }, { "text": "禁用", "value": false }], "chapter": "appSettings", "section": "commSettings" }, { "key": "steamInstallPath", "text": "Steam安装位置", "description": "选择Steam安装位置", "type": "PathInput", "selected": "D:\\Program Files (x86)\\Steam", "options": [], "chapter": "appSettings", "section": "pathSettings" }, { "key": "steamLibWithCS2Path", "text": "Steam库位置", "description": "选择包含CS2的游戏库位置", "type": "PathInput", "selected": "", "options": [], "chapter": "appSettings", "section": "pathSettings" }, { "key": "backupSavePath", "text": "备份保存位置", "description": "选择一个位置保存备份", "type": "PathInput", "selected": "D:\\Program Files (x86)\\Steam", "options": [], "chapter": "appSettings", "section": "pathSettings" }, { "key": "test_input", "text": "测试_输入框", "description": "描述文本", "type": "Input", "selected": "的", "options": [], "chapter": "testSettings", "section": "testSettings" }, { "key": "test_select", "text": "测试_选择框", "description": "描述文本", "type": "Select", "selected": "val1", "options": [{ "text": "测试1", "value": "val1" }, { "text": "测试2", "value": "val2" }, { "text": "测试3", "value": "val3" }], "chapter": "testSettings", "section": "testSettings" }, { "key": "test_boolean", "text": "测试_开关", "description": "描述文本", "type": "Boolean", "selected": true, "options": [{ "text": "启用", "value": true }, { "text": "禁用", "value": false }], "chapter": "testSettings", "section": "testSettings" }, { "key": "devView", "text": "开发者工具", "description": "启用开发者工具页面", "type": "Boolean", "selected": true, "options": [{ "text": "启用", "value": true }, { "text": "禁用", "value": false }], "chapter": "appSettings", "section": "commSettings" }, { "key": "cs2InstallPath", "text": "CS2安装位置", "description": "指定CS2安装位置", "type": "PathInput", "selected": "E:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive", "options": [], "chapter": "appSettings", "section": "pathSettings" }, { "key": "test_fileinput", "text": "测试_路径框", "description": "描述文本", "type": "PathInput", "selected": "val1", "options": [], "chapter": "testSettings", "section": "testSettings" }, { "key": "remoteUrlPrefix", "text": "数据请求前缀", "description": "选择云端数据URL前缀用于加速云端数据获取", "type": "Select", "selected": "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/", "options": [{ "text": "JsDelivr<推荐>", "value": "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/" }, { "text": "GitHub", "value": "https://raw.githubusercontent.com/XiaoTangr/CS2H_Data/refs/heads/main/" }, { "text": "GitMirror", "value": "https://raw.gitmirror.com/XiaoTangr/CS2H_Data/refs/heads/main/" }, { "text": "gh-proxy", "value": "https://gh-proxy.com/raw.githubusercontent.com/XiaoTangr/CS2H_Data/refs/heads/main/" }], "chapter": "appSettings", "section": "netSettings" }]
    }, {
        tableName: "Map",
        createSql: `
            CREATE TABLE IF NOT EXISTS Map (
	            "key" TEXT NOT NULL PRIMARY KEY,
	            "value" TEXT
            );
        `,
        defaultData: []
    }
]