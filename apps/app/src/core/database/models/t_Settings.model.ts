import { SettingsRowOptions } from "@/core/models";

export interface t_Settings {
    c_index: number;
    c_key: string;
    c_text: string;
    c_description: string;
    c_type: "Input" | "Boolean" | "Select" | "PathInput" | string;
    c_selected: string | boolean;
    c_options: Array<SettingsRowOptions> | string;
    c_groupName: string;
    c_groupIndex: number;
}
