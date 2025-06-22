import { printDebug } from "@/core/utils/LogUtil";
import { Settings } from "@/models/Settings.model";
import SettingsService from "@/services/Settings.services";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useMapStore } from "./MapStore";


export const useSettingsStore = defineStore("SettingsStore", () => {

    const dbData = ref<Settings[]>([]);
    const viewData = ref<Settings[]>([]);

    const MapStore = useMapStore();

    const groupedViewData = ref();


    const groupOrder = ref();
    const fetchData = async () => {
        printDebug("Fetching data...");
        groupOrder.value = JSON.parse((await MapStore.getOneByKey("groupOrder"))?.value || "[]");
        dbData.value = await SettingsService.getAllSettings();
        viewData.value = await SettingsService.getAllSettings();
    };

    // 放弃更改
    const discardChanges = async () => {

        let changedDataCount = 0;
        changedDataCount = viewData.value.filter((item) => !isDataConsistent.value(item.key)).length;

        if (changedDataCount > 0) {
            fetchData();
            ElNotification.success({
                title: "成功",
                message: `已放弃对 ${changedDataCount} 行数据的更改。`,
            });
        } else {
            ElNotification.info({
                title: "提示",
                message: "没有任何更改。",
            });
        }
    };
    // 保存更改的数据到数据库
    const saveChangedViewData = async () => {
        let changedDataCount = 0;
        changedDataCount = viewData.value.filter((item) => !isDataConsistent.value(item.key)).length;

        if (changedDataCount > 0) {
            viewData.value.forEach(async (item) => {
                if (!isDataConsistent.value(item.key)) {
                    await saveOneData(item).then(() => {
                        ElNotification.success({
                            title: "成功",
                            message: `${item.key} 保存成功。`,
                        });
                    });
                }
            });
            await fetchData();
        } else {
            ElNotification.info({
                title: "提示",
                message: "没有更改需要保存。",
            });
        }


    };

    const isDataConsistent = computed(() => {
        return (key: string): boolean => {
            const dataItem = dbData.value.find((item) => item.key === key)?.selected;
            const viewDataItem = viewData.value.find((item) => item.key === key)?.selected;
            return dataItem === viewDataItem;
        };
    });




    const saveAllData = async () => {
        return await SettingsService.updateAllSettings(viewData.value);
    };


    const saveOneData = async (setting: Settings) => {
        return await SettingsService.updateSetting(setting);
    };

    const qetSettingsByKey = (key: string) => {
        return viewData.value.find((item) => item.key === key);
    };

    return { fetchData, groupedViewData, qetSettingsByKey, discardChanges, saveAllData, saveChangedViewData, saveOneData, isDataConsistent, viewData, dbData };

});