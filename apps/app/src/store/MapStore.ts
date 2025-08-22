import MapRepository from "@/core/repositories/Map.Repository";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Map } from "@/core/models";

export const useMapStore = defineStore("MapStore", () => {
    const dbData = ref<Map[]>([]);
    const viewData = ref<Map[]>([]);

    const fetchData = async () => {
        const res = await MapRepository.findAll(); // Map[] | null
        // 过滤 null 值并保持类型正确
        dbData.value = res.filter((item): item is Map => item !== null);
        // 深拷贝
        viewData.value = JSON.parse(JSON.stringify(dbData.value));
    };
    /**
     * 获取指定 key 的完整数据
     * @param keyName key name
     * @returns {key: string, value: any}
     */
    const getOneByKey = async (keyName: string) => {
        const res = dbData.value.find((item) => item.key === keyName);
        if (res) {
            return res;
        }
        return null;
    };

    /**
     * 获取指定 key 的数据
     * @param keyName key name
     * @returns string of value | null
     */
    const getValueByKey = async (key: string) => {
        const res = dbData.value.find((item) => item.key === key);
        if (res) {
            return res.value;
        }
        return null;
    };
    return { dbData, viewData, getOneByKey, fetchData, getValueByKey };
})
