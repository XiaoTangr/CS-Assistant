
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
        defaultData: [{
            "key": "showViewCheck",
            "text": "检查视图兼容性",
            "description": "显示视图兼容性遮罩层",
            "type": "Boolean",
            "selected": false,
            "options": [
                {
                    "text": "启用",
                    "value": true
                },
                {
                    "text": "禁用",
                    "value": false
                }
            ],
            "chapter": "appSettings",
            "section": "CommSettings"
        }]
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