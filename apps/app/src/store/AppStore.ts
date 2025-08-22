import { ApiService } from "@/core/api";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "./SettingsStore";
import { LogServices } from "@/core/services";

export const useAppStore = defineStore("AppStore", () => {

    const settingsStore = useSettingsStore();


    // 更新器远程数据
    const updater_remoteData = ref<any>();
    // 完整新版本版本号
    const updater_remoteData_fullVersion = computed<string>(() => {
        const platforms = updater_remoteData.value?.rawJson.platforms;
        if (!platforms) return undefined;
        const platformValues: any[] = Object.values(platforms);
        let link = platformValues[0]?.url;
        // 从link中获取版本号位于路径/download/和下一个/之间
        const version = link.match(/\/download\/([^\/]+)\//)?.[1];
        return version;
    })
    // 是否已检查更新
    const updater_isChecked = ref<boolean>();

    const updater_showDialog = ref<boolean>();




    const fetchData = async () => {
        updater_showDialog.value = settingsStore.getViewDataItemByKey('showUpdateDialog')?.selected as boolean;
    }
    const checkUpdate = async () => {
        if (updater_isChecked.value) {
            return;
        }
        await ApiService.getUpdateCheck().then(res => {
            updater_remoteData.value = res;
            updater_isChecked.value = true;
        }).catch(err => {
            LogServices.error(err.toString());
        });
    }

    return { updater_remoteData, updater_isChecked, updater_showDialog, updater_remoteData_fullVersion, fetchData, checkUpdate, settingsStore };
})
