import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { FileOrDir } from "../types/types";



/**
 * @description 检查文件是否存在
 * @param filePath 文件路径
 * @returns {Promise<boolean>} 文件是否存在
 */
export const isFileExists = async (filePath: string): Promise<boolean> => {
    if (!filePath) return false;
    return invoke("is_file_exists", { filePath: filePath });
}

export const readFileAsBase64 = async (filePath: string): Promise<string | null> => {
    if (!filePath || !(await isFileExists(filePath))) return null;
    const base64Str = await invoke<string>("read_file_as_base64", { filePath: filePath });
    return base64Str;
};



/**
 * @description 选择目录路径
 * @returns {Promise<string | null>} 选择的目录路径
 */
export const selectDirectoryPath = async (): Promise<string | undefined> => {
    try {
        const file = await open({
            multiple: false,
            directory: true,
        });
        if (file && typeof file === 'string') return file;
        else return undefined;
    } catch (error: any) {
        throw Error(error);
    }
};

/**
 * @description 自定义dirname实现，替代node.js path.dirname
 * @param filePath 文件路径
 * @returns 父目录路径
 */
export const dirname = (filePath: string): string => {
    // 处理Windows和Unix风格的路径
    const lastSlashIndex = Math.max(
        filePath.lastIndexOf('/'),
        filePath.lastIndexOf('\\')
    );

    if (lastSlashIndex === -1) {
        return '';
    }

    return filePath.slice(0, lastSlashIndex);
}
/**
 * @description 获取文件路径
 * @param {string} [fileName] 文件名称(可选)
 * @param {string[]} [fileTypes] 文件类型(可选)
 * @returns {Promise<{directoryPath: string | null, filePath: string | null}>} 包含目录路径和完整文件路径的对象
 */
export const selectFilePath = async (
    fileName?: string,
    fileTypes?: string[]
): Promise<{ directoryPath: string | null; filePath: string | null }> => {
    try {
        const selectedFile = await open({
            multiple: false,
            directory: false,
            defaultPath: fileName || undefined,
            filters: fileTypes ? [{ name: '指定文件', extensions: fileTypes }] : undefined
        });

        if (selectedFile && typeof selectedFile === 'string') {
            return {
                directoryPath: dirname(selectedFile),
                filePath: selectedFile
            };
        }

        return { directoryPath: null, filePath: null };
    } catch (error) {
        return { directoryPath: null, filePath: null };
    }
};



/**
 * @description 搜索指定目录下匹配的文件
 * @param dirPath 搜索的根目录路径
 * @param fileName 文件名
 * @param options 可选参数
 * @param options.depth 搜索深度，默认-1表示搜索全部
 * @param options.caseSensitive 是否区分大小写，默认false
 * @returns 匹配的文件路径数组
 */
export const searchFilesByName = async (
    dirPath: string,
    fileName: string,
    options: { depth?: number; caseSensitive?: boolean } = {}
): Promise<string[]> => {
    const { depth = -1, caseSensitive = false } = options;

    // 获取目录结构数据
    const data = await invoke<FileOrDir>("list_files_and_directories", {
        dirPath: dirPath,
    });

    // 递归查找匹配的文件
    const result: string[] = [];
    const findFiles = (node: FileOrDir, currentDepth: number) => {
        if (!node.is_directory) {
            const isMatch = caseSensitive
                ? node.name === fileName
                : node.name.toLowerCase() === fileName.toLowerCase();
            
            if (isMatch) {
                result.push(node.path);
            }
        }
        
        if (node.children && (depth === -1 || currentDepth < depth)) {
            node.children.forEach(child => findFiles(child, currentDepth + 1));
        }
    };

    findFiles(data, 0);
    return result;
};

