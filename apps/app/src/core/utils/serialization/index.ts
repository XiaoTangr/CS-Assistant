// 导出所有序列化相关功能
export * from './parser';
export * from './serializer';

// 添加一些常用的别名
export { deepParseJSON as parse } from './parser';
export { deepStringifyJSON as stringify } from './serializer';