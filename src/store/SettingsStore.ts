import LogUtil from "@/core/utils/LogUtil";
import { Settings } from "@/models/Settings.model";
import SettingsService from "@/services/Settings.services";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSettingsStore = defineStore("SettingsStore", () => {

    const dbData = ref<Settings[] | null>();
    const viewData = ref<Settings[] | null>();

    // 分组后的数据
    const groupedViewData = computed(() => {
        // 处理空值情况
        const currentViewData = viewData.value ?? [];
        const sortedByIndex = [...currentViewData].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        const grouped: Record<string, Settings[]> = {};
        for (const item of sortedByIndex) {
            if (!item.groupName) {
                console.warn('Encountered setting with undefined groupName', item);
                continue;
            }
            if (!grouped[item.groupName]) {
                grouped[item.groupName] = [];
            }
            grouped[item.groupName].push(item);
        }
        const result: Record<string, Settings[]> = {};
        const sortedGroups = Object.entries(grouped).sort(([groupA], [groupB]) => {
            const groupAInfo = (currentViewData ?? []).find(g => g.groupName === groupA);
            const groupBInfo = (currentViewData ?? []).find(g => g.groupName === groupB);
            const indexA = groupAInfo?.groupIndex ?? 0;
            const indexB = groupBInfo?.groupIndex ?? 0;
            return indexA - indexB;
        });
        for (const [groupName, items] of sortedGroups) {
            result[groupName] = items;
        }
        return result;
    });
    const fetchData = async () => {
        dbData.value = await SettingsService.getAllSettings();
        viewData.value = await SettingsService.getAllSettings();
    };

    /**
     * 检查数据一致性：比较 viewData 和 dbData 中对应 key 的 selected 值是否一致
     * @param key - 设置项的唯一标识符
     * @returns Boolean - 是否一致
     */
    const isDataConsistent = (key: string): boolean => {
        const dbItem = (dbData.value ?? []).find((item: Settings) => item.key === key);
        const viewItem = (viewData.value ?? []).find((item: Settings) => item.key === key);

        if (!dbItem || !viewItem) {
            LogUtil.error(`找不到 key 为 ${key} 的设置项`, { dbItem, viewItem });
            return false;
        }

        // 使用深度比较来支持复杂类型（如数组、对象）
        const isStrictEqual = JSON.stringify(dbItem.selected) === JSON.stringify(viewItem.selected);
        return isStrictEqual;
    };

    /**
     * 通过key获取dbData中的数据
     * @param key key name
     * @returns Settings | null
     */
    const getDbDataItemByKey = (key: string): Settings | null => {
        return (dbData.value ?? []).find((item: Settings) => item.key === key) || null;
    };
    /**
     * 通过key获取viewData中的数据
     * @param key key name
     * @returns Settings | null
     */
    const getViewDataItemByKey = (key: string): Settings | null => {
        return (viewData.value ?? []).find((item: Settings) => item.key === key) || null;
    };
    // 放弃更改
    const discardChanges = async () => {
        let changedDataCount = 0;
        changedDataCount = (viewData.value ?? []).filter((item: Settings) => !isDataConsistent(item.key ?? '')).length;
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
        // 获取变更项
        const changedItems = (viewData.value ?? []).filter((item: Settings) => !isDataConsistent(item.key ?? ''));

        if (changedItems.length === 0) {
            ElNotification.info({
                title: "提示",
                message: "没有更改需要保存。",
            });
            return;
        }

        try {
            // 并行保存所有变更项
            await Promise.all(
                changedItems.map(async (item: Settings) => {
                    LogUtil.debug(`正在保存配置项：${item.key ?? ''}`, item);
                    await saveOneData(item);
                    ElNotification.success({
                        title: "成功",
                        message: `${item.key} 已保存。`,
                    });
                })
            );

            // 所有数据保存完成后刷新视图数据
            await fetchData();
        } catch (error) {
            LogUtil.error("保存或刷新过程中发生错误：", error);
            ElNotification.error({
                title: "错误",
                message: "保存过程中发生错误，请查看控制台日志。",
            });
        }
    };

    const saveOneData = async (setting: Settings | null) => {
        if (!setting) {
            return;
        }
        return await SettingsService.updateSetting(setting);
    };


    return { fetchData, groupedViewData, discardChanges, saveChangedViewData, saveOneData, isDataConsistent, getViewDataItemByKey, getDbDataItemByKey, viewData, dbData };

});