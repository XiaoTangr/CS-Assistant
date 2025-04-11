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

interface steamFID {
    steamUid: string,
    steamFriendId: string;
} 