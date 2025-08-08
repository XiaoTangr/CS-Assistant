import MapRepository from "@/core/repositories/Map.Repository";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Map } from "@/core/models";

export const useMapStore = defineStore("MapStore", () => {
    const dbData = ref<Map[]>([]);
    const viewData = ref<Map[]>([]);

    const fetchData = async () => {
        const res = await MapRepository.queryAll(); // Map[] | null
        // 过滤 null 值并保持类型正确
        dbData.value = res.filter((item): item is Map => item !== null);
        // 深拷贝
        viewData.value = JSON.parse(JSON.stringify(dbData.value));
    };

    const getOneByKey = async (key: string) => {
        const res = dbData.value.find((item) => item.key === key);
        if (res) {
            return res;
        }
        return null;
    };

    return { dbData, viewData, getOneByKey, fetchData };
})
