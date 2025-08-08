export interface BackupAndRecovery {
    // 主键
    id: number;
    // 所属用户昵称
    nickName: string;
    // 所属用户好友ID
    friendId: string;
    // 描述
    description?: string;
    // 创建日期
    createdAt: number;
    // 文件夹路径
    folderPath: string;
}
