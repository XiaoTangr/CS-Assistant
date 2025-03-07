
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