import { t_Map, t_Settings } from "./models";

export const updateData = {
    //最低app版本
    needAppVersion: "1.1.0",
    setDBVersion: "1.1.0",
    data: {
        t_settings: [
            {
                filter: { c_key: "auto_update" },
                data: { c_selected: true } as t_Settings
            },
            {
                filter: { c_key: "ef" },
                data: { c_selected: true } as t_Settings
            }
        ],
        t_map: [
            {
                filter: { c_key: "auto_update" },
                data: { c_value: true } as t_Map
            },
            {
                filter: { c_key: "ef" },
                data: { c_value: true } as t_Map
            }
        ]
    }
}

