import { t_BackupAndRecovery } from "./t_BackupAndRecovery.model";
import { t_Map } from "./t_Map.models";
import { t_Settings } from "./t_Settings.model";

export type { t_Settings } from "./t_Settings.model"
export type { t_Map } from "./t_Map.models"
export type { t_BackupAndRecovery } from "./t_BackupAndRecovery.model"


// 定义类型映射
export type TableTypeMap = {
    t_Settings: t_Settings,
    t_Map: t_Map,
    t_BackupAndRecovery: t_BackupAndRecovery
}

