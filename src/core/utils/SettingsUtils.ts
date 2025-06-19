// src/core/utils/settingUtils.ts
import { Settings } from "@/models/Settings.model";

export const groupAndSortSettings = (settings: Settings[]) => {
    const grouped = settings.reduce((acc, setting) => {
        if (!acc[setting.section]) acc[setting.section] = [];
        acc[setting.section].push(setting);
        return acc;
    }, {} as Record<string, Settings[]>);

    Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => a.index - b.index);
    });

    return grouped;
}