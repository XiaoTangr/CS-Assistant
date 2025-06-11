/**
 * Steam 登录用户信息
 */
interface SteamLoginUser {
    AccountName: string;
    PersonaName: string;
    RememberPassword: number; // 布尔值用 0/1 表示
    WantsOfflineMode: number;
    SkipOfflineModeWarning: number;
    AllowAutoLogin: number;
    MostRecent: number;
    Timestamp: number;
}

/**
 * Steam 用户基础信息
 */
interface SteamUserBasicInfo {
    AccountName: string;
    PersonaName: string;
    steamId: string;
    FriendId: string;
    avatarBase64: string;
}

/**
 * 公告信息结构
 */
interface Notice {
    publishDate: string;
    publishContent: string;
}

/**
 * 数据库迁移结果接口
 */
export interface MigrationResult {
    success: boolean;                // 是否整体成功
    createdTables: string[];         // 成功创建的表名
    insertedDataResults: {          // 插入数据的结果
        table: string;
        success: boolean;
    }[];
    error?: Error;                   // 错误信息（如果存在）
}