
import { invoke } from '@tauri-apps/api/core';
import LogService from '@/core/service/logService';
import * as VDF from 'vdf-parser';
import { VDFParseOptions, VDFStringifyOptions } from 'vdf-parser';
/**
 * @description 从指定路径读取 VDF 文件并解析为对象
 * @param filePath 文件路径
 * @returns 解析后的对象
 * @throws 如果读取或解析失败
 */
export const getVdfObjectByFilePath = async (filePath: string): Promise<Record<string, any>> => {
    try {
        const fileContent: string = await invoke("read_text_file", { filePath: filePath });
        return parseVDF(fileContent);
    } catch (error: any) {
        const errorMessage = error.message || String(error);
        LogService.error(`[VdfUtil] 读取或解析 VDF 文件失败: ${filePath}`, error);
        throw new Error(`读取或解析 VDF 文件失败: ${errorMessage}`);
    }
};
/**
 * @description 解析 VDF 格式的字符串为对象
 * @param vdfString VDF 格式的字符串
 * @param options 可选的解析选项
 * @returns 解析后的对象
 * @throws 如果解析失败
 */
export const parseVDF = <T>(vdfString: string, options?: VDFParseOptions | boolean): T => {
    try {
        return VDF.parse(vdfString, options);
    } catch (error: any) {
        const errorMessage = error.message || String(error);
        LogService.error(`[VdfUtil] 解析 VDF 文件失败`, error);
        throw new Error(`解析 VDF 文件失败: ${errorMessage}`);
    }
}



/**
 * @description 将对象序列化为 VDF 格式的字符串
 * @param obj 要序列化的对象
 * @returns VDF 格式的字符串
 * @throws 如果序列化失败
 */
export const stringifyVDF = (obj: object, options?: VDFStringifyOptions | boolean): string => {
    try {
        return VDF.stringify(obj, options);
    } catch (error: any) {
        const errorMessage = error.message || String(error);
        LogService.error(`[VdfUtil] 序列化对象为 VDF 字符串失败`, error);
        throw new Error(`序列化对象为 VDF 字符串失败: ${errorMessage}`);
    }
};
