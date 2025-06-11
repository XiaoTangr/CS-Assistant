import { Settings } from "@/models/Settings.model";
import SettingsDTO from "@/repositories/SettingsRepository";
import { deepParseJSON } from "@/core/utils/JSONUtil";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSettingsStore = defineStore("SettingsStore", () => {
    const data = ref<Settings[]>([]);
    const modifedData = ref<Settings[]>([]);
    const isInitialized = ref(false);
    const isDataupdated = computed(() => {
        return JSON.stringify(data.value) !== JSON.stringify(modifedData.value);
    })

    const refreshData = () => {
        isInitialized.value = false;
        fetchData();
    }


    const fetchData = async () => {
        if (!isInitialized.value) {
            const res = await SettingsDTO.queryAll();
            if (res) {
                const nonNullData = deepParseJSON(res.filter((item: any): item is Settings[] => item !== null));
                if (nonNullData.length > 0) {
                    data.value = nonNullData.flat();
                    modifedData.value = JSON.parse((JSON.stringify(data.value)))
                }
            }
            isInitialized.value = true;
        } else {
            console.log("data already initialized")
        }
    };

    const getDataByChapterAndSection = (chapter: string, section: string) => {
        return data.value.filter((item) => item.chapter === chapter && item.section === section);
    }
    const getModifedDataByChapterAndSection = (chapter: string, section: string) => {
        return modifedData.value.filter((item) => item.chapter === chapter && item.section === section);
    }

    const getNeedUpdateDataByChapterAndSection = (chapter: string, section: string) => {
        return modifedData.value.filter((item) => item.chapter === chapter && item.section === section && item.selected !== data.value.find((dataItem) => dataItem.key === item.key)?.selected);
    }

    const saveModifedDataByChapterAndSection = async (chapter: string, section: string) => {
        SettingsDTO.updateRows(getNeedUpdateDataByChapterAndSection(chapter, section)).then((res) => {
            if (res) {
                ElNotification.success("保存成功");
                refreshData();
                return res;
            }
        });
    }

    const saveAllModifedData = async () => {
        let updatePromises: Promise<any>[] = [];
        let changedRowsCount = 0;
        // 收集所有需要更新的行的 Promise
        modifedData.value.forEach((element: Settings, index: number) => {
            if (element.selected !== data.value[index].selected) {
                const updatePromise = SettingsDTO.updateRow(element).then((res) => {
                    if (res) {
                        changedRowsCount++;
                        console.log("updated row: ", element);
                    }
                    return res;
                });
                updatePromises.push(updatePromise);
            }
        });
        // 等待所有更新完成
        await Promise.all(updatePromises);
        // 更新完成后显示通知并刷新数据
        if (changedRowsCount > 0) {
            ElNotification.success(`${changedRowsCount} rows updated`);
        }
        // 所有更新完成后再获取新数据
        refreshData();
    };

    // Modify the getDataByKeyName function in your store
    const getDataByKeyName = (keyName: string) => {
        return computed(() => {
            return data.value.find(item => item.key === keyName);
        });
    };

    const saveRow = async (row: Settings) => {
        await SettingsDTO.updateRow(row);
        refreshData()
    }

    return { data, modifedData, isDataupdated, saveRow, refreshData, fetchData, getDataByKeyName, getDataByChapterAndSection, getModifedDataByChapterAndSection, saveAllModifedData, saveModifedDataByChapterAndSection };
});
