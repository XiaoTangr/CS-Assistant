import { SettingsRowOptions } from "@/core/models";

export interface t_Settings {
    c_index: number | null;
    c_key: string | null;
    c_text: string | null;
    c_description: string | null;
    c_type: "Input" | "Boolean" | "Select" | "PathInput" | string | null;
    c_selected: string | boolean | null;
    c_options: Array<SettingsRowOptions> | null;
    c_groupName: string | null;
    c_groupIndex: number | null;
}
