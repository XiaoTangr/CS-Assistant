import { groupAndSortSettings } from "@/core/utils/SettingsUtils";
import { Settings } from "@/models/Settings.model";
import SettingsService from "@/services/Settings.services";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSettingsStore = defineStore("SettingsStore", () => {

    const data = ref<Settings[]>([]);
    const unSavedData = ref<Settings[]>([]);


    const groupedData = computed(() => groupAndSortSettings(data.value));

    const groupedUnSavedData = computed(() => groupAndSortSettings(unSavedData.value));


    const isDataConsistent = computed(() => {
        return (key: string): boolean => {
            const dataItem = data.value.find((item) => item.key === key);
            const unSavedDataItem = unSavedData.value.find((item) => item.key === key);

            // 如果两者都不存在该 key，则视为一致
            if (!dataItem && !unSavedDataItem) return true;

            // 如果其中一个存在而另一个不存在，则视为不一致
            if (!dataItem || !unSavedDataItem) return false;

            // 使用 JSON.stringify 进行深度比较
            return JSON.stringify(dataItem) === JSON.stringify(unSavedDataItem);
        };
    });


    const fetchData = async () => {
        data.value = await SettingsService.getAllSettings();
        unSavedData.value = await SettingsService.getAllSettings();
    };

    const saveAllData = async () => {
        const res = await SettingsService.updateAllSettings(unSavedData.value);
        if (res > 0) {
            ElNotification.success({
                title: "成功",
                message: `所有更改已保存,一共${res}行数据。`,
            });
            await fetchData();
        } else {
            ElNotification.error({
                title: "错误",
                message: "保存更改失败，请重试。",
            });
        }
    };


    const saveOneData = async (setting: Settings) => {
        const res = await SettingsService.updateSetting(setting);
        if (res > 0) {
            ElNotification.success({
                title: "成功",
                message: `${setting.key} 更新成功。`,
            });
            await fetchData();
        } else {
            ElNotification.error({
                title: "错误",
                message: "更新失败，请重试。",
            });
        }
    };

    const qetSettingsByKey = (key: string) => {
        return unSavedData.value.find((item) => item.key === key);
    };


    return { fetchData, qetSettingsByKey, saveAllData, saveOneData, isDataConsistent, unSavedData, data, groupedData, groupedUnSavedData };



    // // 原始数据（来自数据库）
    // const data = ref<Settings[]>([]);

    // // 用户修改的数据副本（用于脏检查）
    // const modifedData = ref<Settings[]>([]);

    // // 分组后的原始数据（用于展示默认状态）
    // const groupedData = computed(() => groupAndSortSettings(data.value));

    // // 分组后的修改数据（用于检测变更和预览）
    // const modifedGroupedData = computed(() => groupAndSortSettings(modifedData.value));

    // /**
    //  * 加载所有设置数据到 store
    //  */
    // const loadSettings = async () => {
    //     try {
    //         const settings = await SettingsService.getAllSettings();
    //         data.value = settings;
    //         modifedData.value = [...settings]; // 初始化为相同副本
    //     } catch (error) {
    //         console.error("Failed to load settings:", error);
    //         ElNotification.error({
    //             title: "错误",
    //             message: "加载设置失败，请重试。",
    //         });
    //     }
    // };

    // const qetSettingsByKey = (key: string) => {
    //     return modifedData.value.find((item) => item.key === key);
    // };


    // /**
    //  * 判断是否有未保存的更改
    //  */
    // const hasUnsavedChanges = computed(() => {
    //     return JSON.stringify(data.value) !== JSON.stringify(modifedData.value);
    // });

    // /**
    //  * 更新单个设置项（仅更新 modifedData）
    //  * @param setting - 新的 Setting 对象
    //  */
    // const updateModifedSetting = (setting: Settings) => {
    //     const index = modifedData.value.findIndex((s) => s.key === setting.key);
    //     if (index !== -1) {
    //         modifedData.value[index] = setting;
    //     }
    // };

    // /**
    //  * 提交修改到数据库并同步 data
    //  */
    // const saveAllModifications = async () => {
    //     try {
    //         const diff = modifedData.value.filter(
    //             (item) =>
    //                 JSON.stringify(item) !==
    //                 JSON.stringify(data.value.find((d) => d.key === item.key))
    //         );

    //         if (diff.length === 0) {
    //             ElNotification.info({
    //                 title: "提示",
    //                 message: "没有需要保存的更改。",
    //             });
    //             return;
    //         }

    //         // 调用服务层批量更新
    //         const affectedRows = await SettingsService.updateSettings(modifedData.value);

    //         if (affectedRows > 0) {
    //             data.value = [...modifedData.value];
    //             ElNotification.success({
    //                 title: "成功",
    //                 message: "所有更改已保存。",
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Failed to save modifications:", error);
    //         ElNotification.error({
    //             title: "错误",
    //             message: "保存更改失败，请重试。",
    //         });
    //     }
    // };

    // /**
    //  * 撤销所有未保存的更改
    //  */
    // const discardChanges = () => {
    //     modifedData.value = data.value.map((item) => ({ ...item }));
    //     ElNotification.info({
    //         title: "撤销",
    //         message: "所有未保存的更改已撤销。",
    //     });
    // };

    // /**
    //  * 添加新的设置项到 modifedData（不立即写入数据库）
    //  */
    // const addModifedSetting = (setting: Settings) => {
    //     modifedData.value.push(setting);
    // };

    // /**
    //  * 删除指定 key 的设置项（仅在 modifedData 中标记删除）
    //  */
    // const deleteModifedSetting = (key: string) => {
    //     modifedData.value = modifedData.value.filter((item) => item.key !== key);
    // };

    // return {
    //     data,
    //     modifedData,
    //     groupedData,
    //     modifedGroupedData,
    //     hasUnsavedChanges,
    //     qetSettingsByKey,
    //     loadSettings,
    //     updateModifedSetting,
    //     saveAllModifications,
    //     discardChanges,
    //     addModifedSetting,
    //     deleteModifedSetting,
    // };
});