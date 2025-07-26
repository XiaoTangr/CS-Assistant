
import { invoke } from '@tauri-apps/api/core';
import { parse } from '@/core/utils/serialization';
/**
 * @description 从指定路径读取 VDF 文件并解析为对象
 * @param filePath 文件路径
 * @returns 解析后的对象
 * @throws 如果读取或解析失败
 */
export const getVdfObjectByFilePath = async (filePath: string): Promise<Record<string, any>> => {
    try {
        const fileContent: string = await invoke("read_text_file", { filePath: filePath });
        const parsed = parseVDF(fileContent);
        return <Record<string, any>>parse(parsed);
    } catch (error: any) {
        const errorMessage = error.message || String(error);
        console.error(`[VdfUtil] 读取或解析 VDF 文件失败: ${filePath}`, error);
        throw new Error(`读取或解析 VDF 文件失败: ${errorMessage}`);
    }
};


/**
 * 将 VDF 字符串解析为 JavaScript 对象
 * @param vdfString VDF 格式的字符串
 * @returns 解析后的 JavaScript 对象
 */
export const parseVDF = (vdfString: string): Record<string, any> => {
    const tokens = tokenizeVDF(vdfString);
    return parseVDFTokens(tokens);
};

/**
 * 将 JavaScript 对象序列化为 VDF 字符串
 * @param obj 要序列化的对象
 * @param pretty 是否格式化输出
 * @returns VDF 格式的字符串
 */
export const stringifyVDF = (obj: Record<string, any>, pretty = false): string =>
    serializeObject(obj, pretty ? 0 : -1);

// ============== 内部实现 ==============

type VDFToken = {
    type: 'string' | 'open' | 'close';
    value: string;
};

const tokenizeVDF = (input: string): VDFToken[] => {
    const tokens: VDFToken[] = [];
    let current = 0;
    let line = 1;
    let column = 1;

    while (current < input.length) {
        const char = input[current];

        // 跳过空白字符
        if (/\s/.test(char)) {
            if (char === '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
            current++;
            continue;
        }

        // 处理注释
        if (char === '/' && input[current + 1] === '/') {
            while (current < input.length && input[current] !== '\n') {
                current++;
                column++;
            }
            continue;
        }

        // 处理字符串
        if (char === '"') {
            let value = '';
            current++;
            column++;

            while (current < input.length && input[current] !== '"') {
                if (input[current] === '\\') {
                    current++;
                    column++;
                    if (current >= input.length) break;
                }
                value += input[current];
                current++;
                column++;
            }

            tokens.push({ type: 'string', value });
            current++;
            column++;
            continue;
        }

        // 处理大括号
        if (char === '{') {
            tokens.push({ type: 'open', value: '{' });
            current++;
            column++;
            continue;
        }

        if (char === '}') {
            tokens.push({ type: 'close', value: '}' });
            current++;
            column++;
            continue;
        }

        // 处理不带引号的字符串
        let value = '';
        while (current < input.length && !/\s|{|}/.test(input[current])) {
            value += input[current];
            current++;
            column++;
        }
        if (value) {
            tokens.push({ type: 'string', value });
        }
    }

    return tokens;
};

const parseVDFTokens = (tokens: VDFToken[]): Record<string, any> => {
    let current = 0;

    const walk = (): any => {
        let token = tokens[current];
        const node: Record<string, any> = {};

        while (current < tokens.length && token.type !== 'close') {
            if (token.type === 'string') {
                const key = token.value;
                current++;
                token = tokens[current];

                // 简单键值对
                if (token?.type === 'string') {
                    node[key] = token.value;
                    current++;
                }
                // 嵌套对象
                else if (token?.type === 'open') {
                    current++;
                    node[key] = walk();
                }
            } else if (token.type === 'open') {
                current++;
                return walk();
            }

            token = tokens[current];
        }

        current++;
        return node;
    };

    return walk();
};

const serializeObject = (obj: Record<string, any>, indentLevel: number): string => {
    let result = '';
    const indent = indentLevel >= 0 ? '  '.repeat(indentLevel) : '';
    const newLine = indentLevel >= 0 ? '\n' : '';

    Object.entries(obj).forEach(([key, value]) => {
        result += `${indent}"${escapeString(key)}"`;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += `${newLine}${indent}{${newLine}`;
            result += serializeObject(value, indentLevel >= 0 ? indentLevel + 1 : -1);
            result += `${indent}}${newLine}`;
        } else {
            const strValue = Array.isArray(value) ? value.join(' ') : String(value);
            result += ` "${escapeString(strValue)}"${newLine}`;
        }
    });

    return result;
};

const escapeString = (str: string): string =>
    str.replace(/"/g, '\\"').replace(/\n/g, '\\n');