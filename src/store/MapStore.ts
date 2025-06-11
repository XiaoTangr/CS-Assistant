import MapRepository from "@/repositories/MapRepository";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Map } from "@/models/Map.model";


export const useMapStore = defineStore("MapStore", () => {
    const data = ref<Map[]>([]);
    const modifedData = ref<Map[]>([]);
    const isInitialized = ref(false);
    const isDataupdated = computed(() => {
        return JSON.stringify(data.value) !== JSON.stringify(modifedData.value);
    })


    const fetchData = async () => {
        if (!isInitialized.value) {
            const res = await MapRepository.queryAll(); // Map[] | null

            if (res) {
                // 过滤 null 值并保持类型正确
                data.value = res.filter((item): item is Map => item !== null);

                // 深拷贝
                modifedData.value = JSON.parse(JSON.stringify(data.value));
            }

            isInitialized.value = true;
        }
    };



    return { data, modifedData, isDataupdated, fetchData };
});
