/**
 * 目录实体类型：描述文件/目录的基础信息，支持递归子级
 */
export type DirEntity = {
    name: string;
    path: string;
    is_directory: boolean;
    child?: DirEntity[];
};

/**
 * 文件/文件夹类型枚举：限定操作类型，TS字面量类型保证类型安全
 */
export type FsType = 'file' | 'dir';

/**
 * 基础文件系统配置：所有操作的通用配置基类
 */
export interface BaseFsConfig {
    /** 操作类型：文件/文件夹 */
    fsType: FsType;
}

/**
 * 创建操作配置：继承基础配置，扩展专属选项
 */
export interface CreateFsConfig extends BaseFsConfig {
    /** 仅对dir有效：是否递归创建父目录（默认true） */
    recursive?: boolean;
    /** 仅对file有效：是否覆盖已存在文件（默认false） */
    overwrite?: boolean;
}

/**
 * 删除操作配置：继承基础配置，扩展专属选项
 */
export interface DeleteFsConfig extends BaseFsConfig {
    /** 仅对dir有效：是否递归删除子内容（默认false，仅删空文件夹） */
    recursive?: boolean;
}

/**
 * 重命名/移动操作配置：仅继承基础配置，无专属扩展
 */
// export interface RenameFsConfig extends BaseFsConfig { }

/**
 * 类型判断操作配置：仅继承基础配置，无专属扩展
 */
export interface IsTypeFsConfig extends BaseFsConfig { }

/**
 * 复制操作配置：继承基础配置，扩展专属选项
 */
export interface CopyFsConfig extends BaseFsConfig {
    /** 是否覆盖已存在目标路径（文件/文件夹通用，默认false） */
    overwrite?: boolean;
}