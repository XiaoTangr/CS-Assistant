interface SteamLoginUser {
    AccountName: string;
    PersonaName: string;
    RememberPassword: number;
    WantsOfflineMode: number;
    SkipOfflineModeWarning: number;
    AllowAutoLogin: number;
    MostRecent: number;
    Timestamp: number;
}

interface SteamUserBasicInfo {
    AccountName: string;
    PersonaName: string;
    steamId: string,
    FriendId: string;
    avatarBase64: string;
} 