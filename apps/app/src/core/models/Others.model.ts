/**
 * Steam 登录用户信息
 */
export interface SteamLoginUser {
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
export interface BasicSteamLoginUser {
    AccountName: string | null;
    PersonaName: string | null;
    steamId: number | null;
    FriendId: number | null;
    avatarBase64: string | null;
}

/**
 * 公告信息结构
 */
export interface Notice {
    publishTitle: string | null,
    publishDate: string | null;
    publishContent: string | null;
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
export interface GroupOrderItem {
    gn: string;
    go: number;
}


// FileOrDir 类型定义
export interface FileOrDir {
    name: string;
    path: string;
    is_directory: boolean;
    children: FileOrDir[];
}


// 定义响应结构，使用严格的泛型
export interface ApiResponse<T = Record<string, unknown>> {
    data: T | null;  // 使用 null 而不是 undefined 表示无数据
    code: number;
    success: boolean;
    headers: Record<string, string>;
    message?: string;
}

// 定义请求配置，使用严格的类型
export interface RequestConfig<B = Record<string, unknown>> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: B;
    timeout?: number;
}
