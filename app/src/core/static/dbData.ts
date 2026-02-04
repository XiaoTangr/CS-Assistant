export const dbData = {
    dbtype: "sqlite",
    needAppVersion: "1.0.4",
    setDBVersion: "1.0.5",
    tables: [
        {
            name: "t_Backup",
            columns: [
                {
                    name: "c_id",
                    type: "integer",
                    primaryKey: true,
                    autoIncrement: false,
                    notNull: true,
                    unique: true,
                },
                {
                    name: "c_nickName",
                    type: "text",
                },
                {
                    name: "c_friendId",
                    type: "text",
                },
                {
                    name: "c_description",
                    type: "text",
                },
                {
                    name: "c_folderPath",
                    type: "text",
                },
            ],
            defData: [],
            updateData: [],
            dropData: [],
        },
        {
            name: "t_KeyValue",
            columns: [
                {
                    name: "c_key",
                    type: "text",
                    primaryKey: true,
                    autoIncrement: false,
                    notNull: false,
                    unique: true,
                },
                {
                    name: "c_value",
                    type: "text",
                }
            ],
            defData:[
                {
                    c_key: "App_Github",
                    c_value: "https://github.com/XiaoTangr/CS-Assistant"
                }
            ]
        }
    ],
}
