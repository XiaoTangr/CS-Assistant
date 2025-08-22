export interface t_BackupAndRecovery {
    // 主键
    c_id: number;
    // 所属用户昵称
    c_nickName: string;
    // 所属用户好友ID
    c_friendId: string;
    // 描述
    c_description: string;
    // 创建日期
    c_createdAt: number;
    // 文件夹路径
    c_folderPath: string;
}
