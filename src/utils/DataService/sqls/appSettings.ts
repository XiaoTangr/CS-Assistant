export const appSettingsSQL = [
    {
        name: "tableCreate",
        sql: `
        CREATE TABLE IF NOT EXISTS appSettings  (
                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                "key" TEXT NOT NULL UNIQUE,
                "value" TEXT,
                "desc" TEXT
            );
    `
    },
    {
        name: "dataInsert",
        sql: `
            insert into appSettings (key, value)values
            ('installed',true)
        `
    }
]
