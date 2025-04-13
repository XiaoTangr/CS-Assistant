interface steamLoginUser {
    AccountName: string;
    PersonaName: string;
    RememberPassword: number;
    WantsOfflineMode: number;
    SkipOfflineModeWarning: number;
    AllowAutoLogin: number;
    MostRecent: number;
    Timestamp: number;
}

interface steamUserLessInfo {
    AccountName: string;
    PersonaName: string;
    steamId: string,
    FriendId: string;
    avatarBase64: string;
} 