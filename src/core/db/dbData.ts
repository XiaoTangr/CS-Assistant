
export const DbData = [
    {
        tableName: "Settings",
        Structure: [
            { name: "key", type: "text", nullable: false },
            { name: "text", type: "text", nullable: true },
            { name: "description", type: "text", nullable: true },
            { name: "selected", type: "text", nullable: true },
            { name: "type", type: "text", nullable: true },
            { name: "options", type: "text", nullable: true },
            { name: "chapter", type: "text", nullable: true },
            { name: "section", type: "text", nullable: true },
        ],
        defaultData: []
    }, {
        tableName: "Map",
        Structure: [
            { name: "key", type: "text", nullable: false },
            { name: "value", type: "text", nullable: true }
        ],
        defaultData: []
    }
]