import { MapRepository } from "../repositories";
import { Map } from "../models";
export default class MapService {
    /**
     * 获取所有Map数据
     * @returns 返回Map对象数组
     */
    static async getAllMap(): Promise<Map[]> {
        return await MapRepository.findAll();
    }
    /**
     * 根据 key 获取单个Map
     * @param key - Map项的键名
     * @returns 返回匹配的 Map 对象或 null
     */
    static async getMapByKey(key: string): Promise<Map | null> {
        return await MapRepository.findOne({ c_key: key });
    }
    /**
     * 根据 key 获取 Value
     * @param key - Map项的键名
     * @returns 返回匹配的 Map 的 value 或 null
     */
    static async getValueByKey(key: string): Promise<any | null> {
        return (await MapRepository.findOne({ c_key: key }))?.value;
    }

    /**
     * 更新单条Map记录
     * @param Map - 要更新的 Map 对象
     * @returns 受影响行数
     */
    static async updateMap(Map: Map): Promise<number> {
        return await MapRepository.updateOne(Map);
    }

    /**
     * 插入新的Map记录
     * @param Map - Map 对象数组
     * @returns 受影响行数
     */
    static async addMapItem(Map: Map[]): Promise<number> {
        return await MapRepository.bulkCreate(Map);
    }

    /**
     * 删除指定 key 的Map记录
     * @param key - 要删除的 key 值
     * @returns 受影响行数
     */
    static async deleteMap(key: string): Promise<number> {
        return await MapRepository.deleteOne({ c_key: key });
    }

    /**
     * 使用默认Map（待实现）
     */
    static async useDefaultMap(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
