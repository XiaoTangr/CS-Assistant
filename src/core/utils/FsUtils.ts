import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
/**
 * @description 检查文件是否存在
 * @param filePath 文件路径
 * @returns {Promise<boolean>} 文件是否存在
 */
export const isFileExists = async (filePath: string): Promise<boolean> => {
    if (!filePath) return false;
    return invoke("is_file_exists", { filepath: filePath });
}


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