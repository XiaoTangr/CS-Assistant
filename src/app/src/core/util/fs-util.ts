/**
 * 通过调用RUST的FS API来进行文件系统操作
 * 避免使用nodejs的fs模块（打包无法识别）、Tauri的fs模块（功能有限）
 * 纯静态方法实现：直接通过RustFs.xxx()调用，无需实例化
 */
import { path } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import { CopyFsConfig, CreateFsConfig, DeleteFsConfig, DirEntity, IsTypeFsConfig } from "../types/fs";



/**
 * 文件系统操作类（纯静态方法实现 + 统一Config配置入参 + 全异步）
 * 核心：无需实例化，直接RustFs.方法名()调用，所有合并操作通过config.fsType指定类型
 */
export class FsUtil {
    /************************** 通用路径处理静态方法 **************************/
    /**
     * 安全拼接多路径片段，自动适配系统分隔符（基于Tauri path实现）
     * @param paths 任意数量的路径片段
     * @returns 拼接后的完整路径
     */
    public static async joinPath(...paths: string[]): Promise<string> {
        return await path.join(...paths);
    }

    /**
     * 将相对路径转为绝对路径
     * @param path 相对路径/待解析路径
     * @returns 解析后的绝对路径
     */
    public static async getAbsolutePath(path: string): Promise<string> {
        // 获取目录结构数据
        return await invoke<string>("get_absolute_path", {
            dirPath: path, recursive: true
        });
    }

    /**
     * 通用路径存在判断（兼容文件/文件夹，无需config）
     * @param path 目标路径
     * @returns 存在返回true，否则返回false
     */
    public static async pathExists(path: string): Promise<boolean> {
        return await invoke<boolean>("path_exists", { path: path });
    }

    /**
     * 拆分路径，分离目录部分和文件名/最后一级目录名
     * @param path 目标路径
     * @returns 包含目录(dir)和基础名(base)的对象
     */
    public static async splitPath(path: string): Promise<{ dir: string; base: string }> {
        return await invoke<{ dir: string; base: string }>("split_path", { path: path });
    }

    /************************** 合并后的核心操作静态方法（统一config配置入参） **************************/
    /**
     * 创建文件/文件夹（合并createFile/createDir）
     * @param targetPath 目标路径（文件/文件夹完整路径）
     * @param config 创建配置：指定操作类型+专属选项
     */
    public static async create(targetPath: string, config: CreateFsConfig): Promise<number> {
        const { fsType, recursive = true, overwrite = false } = config;
        return await invoke<number>("create", { path: targetPath, fsType: fsType, recursive: recursive, overwrite: overwrite });
    }

    /**
     * 删除文件/文件夹（合并deleteFile/deleteDir）
     * @param targetPath 目标路径（文件/文件夹完整路径）
     * @param config 删除配置：指定操作类型+专属选项
     */
    public static async delete(targetPath: string, config: DeleteFsConfig): Promise<number> {
        const { fsType, recursive = false } = config;
        return await invoke<number>("delete", { path: targetPath, fsType: fsType, recursive: recursive });
    }

    /**
     * 重命名/移动文件/文件夹（合并renameFile/renameDir）
     * @param oldPath 原路径（文件/文件夹完整路径）
     * @param newPath 新路径（文件/文件夹完整路径/目标路径）
     * @param config 重命名配置：仅指定操作类型
     */
    public static async rename(oldPath: string, newPath: string): Promise<number> {
        return await invoke<number>("rename", { oldPath: oldPath, newPath: newPath });
    }

    /**
     * 判断路径是否为指定类型（合并isFile/isDir）
     * @param targetPath 目标路径
     * @param config 类型判断配置：仅指定要判断的类型
     * @returns 是指定类型返回true，否则false
     */
    public static async isType(targetPath: string, config: IsTypeFsConfig): Promise<boolean> {
        const { fsType } = config;
        return await invoke<boolean>("is_type", { path: targetPath, fsType: fsType });
    }

    /**
     * 复制文件/文件夹（合并copyFile/copyDir）
     * @param srcPath 源路径（文件/文件夹完整路径）
     * @param dstPath 目标路径（文件/文件夹完整路径）
     * @param config 复制配置：指定操作类型+专属选项
     */
    public static async copy(srcPath: string, dstPath: string, config: CopyFsConfig): Promise<void> {
        const { fsType, overwrite = false } = config;
        if (fsType === 'file') {
            throw new Error(`未实现复制文件：${srcPath} -> ${dstPath}（overwrite=${overwrite}）`);
        } else {
            throw new Error(`未实现复制文件夹：${srcPath} -> ${dstPath}（overwrite=${overwrite}）`);
        }
    }

    /************************** 纯文件操作静态方法 **************************/
    /**
     * 读取文件内容，支持指定编码
     * @param filePath 文件完整路径
     * @param encoding 编码格式（默认utf-8，适配TS原生BufferEncoding）
     * @returns 文件内容字符串
     */
    public static async readFile(
        filePath: string,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<string> {
        throw new Error('未实现 readFile 方法（请基于RUST FS API实现）');
    }

    /**
     * 按行读取文件（适合大文件，避免内存溢出）
     * @param filePath 文件完整路径
     * @param encoding 编码格式（默认utf-8）
     * @returns 每行内容组成的字符串数组
     */
    public static async readFileByLine(
        filePath: string,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<string[]> {
        throw new Error('未实现 readFileByLine 方法（请基于RUST FS API实现）');
    }

    /**
     * 写入文件内容，支持追加/覆盖
     * @param filePath 文件完整路径
     * @param content 要写入的内容（字符串类型）
     * @param append 是否追加写入（默认false：覆盖原有内容）
     * @param encoding 编码格式（默认utf-8）
     */
    public static async writeFile(
        filePath: string,
        content: string,
        append: boolean = false,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<void> {
        throw new Error('未实现 writeFile 方法（请基于RUST FS API实现）');
    }

    /**
     * 获取文件大小，返回字节数
     * @param filePath 文件完整路径
     * @returns 文件大小（字节数）
     */
    public static async getFileSize(filePath: string): Promise<number> {
        throw new Error('未实现 getFileSize 方法（请基于RUST FS API实现）');
    }

    /************************** 纯文件夹操作静态方法 **************************/
    /**
     * 遍历目录内容，返回DirEntity数组，支持递归遍历子目录
     * @param dirPath 目录完整路径
     * @param recursive 是否递归遍历子层级（默认false：仅单层遍历）
     * @returns 目录下所有文件/子目录的DirEntity数组
     */
    public static async listDir(
        dirPath: string,
        recursive: boolean = false
    ): Promise<DirEntity[]> {
        throw new Error('未实现 listDir 方法（请基于RUST FS API实现，返回DirEntity数组）');
    }

    /************************** 通用属性获取静态方法 **************************/
    /**
     * 获取文件/文件夹的基础属性信息
     * @param path 目标路径（文件/文件夹均可）
     * @returns 包含创建时间、修改时间、大小、类型等的属性对象
     */
    public static async getFileStat(path: string): Promise<{
        createTime: Date;
        modifyTime: Date;
        size: number;
        isFile: boolean;
        isDir: boolean;
        mode: number;
    }> {
        throw new Error('未实现 getFileStat 方法（请基于RUST FS API实现）');
    }
}

/**
 * 文件属性返回类型：提取getFileStat的异步返回类型，供业务代码复用
 */
export type FileStat = Awaited<ReturnType<typeof FsUtil.getFileStat>>;
