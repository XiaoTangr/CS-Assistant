
import * as vdfParser from 'vdf-parser';
import { invoke } from '@tauri-apps/api/core';
import { jsonUtil } from './JSONUtil';


namespace VdfUtil {

    /**
     * @description get vdf object by file path
     * @param filePath file path
     * @returns Promise Object
     */
    export const getVdfObjectbyFilePath = async (filePath: string): Promise<Object> => {
        let fileContent: string = await invoke("read_text_file", { filepath: filePath });
        return jsonUtil.deepParseJSON(vdfParser.parse(fileContent))
    }
}

export default VdfUtil;
