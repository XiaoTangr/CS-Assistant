// e:\Projects\Node\Tauri\CS2H\src\utils\VdfUtil.ts

import * as vdfParser from 'vdf-parser';
import { invoke } from '@tauri-apps/api/core';
import { deepParseJSON } from '@/core/utils/JSONUtil';

/**
 * @description 从指定路径读取 VDF 文件并解析为对象
 * @param filePath 文件路径
 * @returns 解析后的对象
 * @throws 如果读取或解析失败
 */
export const getVdfObjectByFilePath = async (filePath: string): Promise<Record<string, any>> => {
    try {
        const fileContent: string = await invoke("read_text_file", { filepath: filePath });
        const parsed = vdfParser.parse(fileContent);
        return <Record<string, any>>deepParseJSON(parsed);
    } catch (error: any) {
        const errorMessage = error.message || String(error);
        console.error(`[VdfUtil] 读取或解析 VDF 文件失败: ${filePath}`, error);
        throw new Error(`读取或解析 VDF 文件失败: ${errorMessage}`);
    }
};