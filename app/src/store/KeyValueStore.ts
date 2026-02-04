import { KeyValue } from "@/core/models";
import { KeyValueService } from "@/core/services";
import { defineStore } from "pinia";

import { ref } from "vue";

export const useKeyValueStore = defineStore("KeyValueStore", () => {
    const dbKV = ref<KeyValue[]>();
    const viewKV = ref<KeyValue[]>();

    const _keyValueService = KeyValueService.getInstance();


    const fetchData = async () => {
        let res = await _keyValueService.getAll();
        dbKV.value = res;
        viewKV.value = res;
    };

    const getDbValue = async (key: string) => {
        return dbKV.value?.find((item) => item.key === key)?.value ?? null;
    };
    const getViewValue = async (key: string) => {
        return viewKV.value?.find((item) => item.key === key)?.value ?? null;
    };


    return { dbKV, viewKV, fetchData, getDbValue, getViewValue };
});
