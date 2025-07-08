import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "./SettingsStore";
import { Settings } from "@/models/Settings.model";
import { BasicSteamLoginUser } from "@/core/types/types";
export const useLoginedSteamUserStore = defineStore("LoginedSteamUserStore", () => {


    const SettingsStore = useSettingsStore();

    const data = ref<BasicSteamLoginUser[] | null>(null)

    // 来自db的相关数据
    // 修改类型定义，提供更明确的类型
    const steamInstallPath = ref<Settings | null>(null);
    const cs2InstallPath = ref<Settings | null>(null);

    // 修改 computed 属性处理 null 情况
    const steamInstallPathStr = computed(() => {
        return steamInstallPath.value?.selected;
    });

    const cs2InstallPathStr = computed(() => {
        return cs2InstallPath.value?.selected;
    });

    const fetchData = async () => {
        await _getViewData();
    }




    const _getViewData = async () => {
        steamInstallPath.value = SettingsStore.getViewDataItemByKey("steamInstallPath");
        cs2InstallPath.value = SettingsStore.getViewDataItemByKey("cs2InstallPath");
    }

    return { data, fetchData, steamInstallPath, cs2InstallPath, steamInstallPathStr, cs2InstallPathStr }
})