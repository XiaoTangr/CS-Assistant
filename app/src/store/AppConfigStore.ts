import { defineStore } from "pinia";
import AppConfigService from "@/core/services/AppConfig.service"
import { computed, ref } from "vue";
import { AppConfig, KeyValue } from "@/core/models";
import { configGroups } from "@/core/static";
import { parseFromJson, stringifyToJson } from "@/core/utils";
import { LogService } from "@/core/services";
export const useAppConfigStore = defineStore("AppConfigStore", () => {
    const appConfigService = AppConfigService.getInstance();

    const dbAppConfig = ref<AppConfig[]>()
    const viewAppConfig = ref<AppConfig[]>()

    // 分组后的页面渲染数据
    const groupedViewAppConfig = computed(() => {
        // 根据configGroups将viewAppConfig.value进行分组，分组的顺序为configGroups.groupId,每组的数据按照AppConfig.order进行排序
        if (!viewAppConfig.value) return [];

        // 创建一个映射，将groupId映射到分组配置
        const groupMap = configGroups.reduce((map, group) => {
            map[group.groupId] = { ...group, configs: [] as AppConfig[] };
            return map;
        }, {} as Record<number, any>);

        // 将配置项按groupId分组
        viewAppConfig.value.forEach(config => {
            if (groupMap[config.groupId]) {
                groupMap[config.groupId].configs.push(config);
            }
        });

        // 对每组内的配置按order排序，并按groupId顺序返回
        return configGroups.map(group => {
            const groupData = groupMap[group.groupId];
            if (groupData && groupData.configs.length > 0) {
                groupData.configs.sort((a: AppConfig, b: AppConfig) => a.order - b.order);
            }
            return groupData;
        }).filter(group => group && group.configs.length > 0);
    })

    // 获取数据
    const fetchData = async () => {
        let res = await appConfigService.getAll();
        dbAppConfig.value = res;
        viewAppConfig.value = parseFromJson(stringifyToJson(res))
    }

    const getViewAppConfig = async (appConfigKey: string): Promise<AppConfig | null> => {
        return viewAppConfig.value?.find(item => item.key === appConfigKey) ?? null;
    }

    const getDbAppConfig = async (appConfigKey: string): Promise<AppConfig | null> => {
        return dbAppConfig.value?.find(item => item.key === appConfigKey) ?? null;
    }

    const saveAppConfig = async (appConfigKey: string) => {
        // 先判断是否有修改
        if (viewAppConfig.value) {
            const appConfig = viewAppConfig.value.find(item => item.key === appConfigKey);
            if (appConfig) {
                await appConfigService.setValue(appConfigKey, appConfig.value);
                return 0;
            } else {
                return -1;
            }
        }
        await fetchData();
    }

    const saveModifiedAppConfig = async () => {
        let paylods: KeyValue[] = [];
        // 从viewAppConfig中找出value与dbApconfig不同的项来构建负载
        viewAppConfig.value?.forEach(item => {
            const dbAppConfigItem = dbAppConfig.value?.find(dbItem => dbItem.key === item.key);
            if (dbAppConfigItem && dbAppConfigItem.value !== item.value) {
                paylods.push({
                    key: item.key,
                    value: item.value
                });
            }
        });
        if (paylods.length <= 0) {
            return -1;
        }
        await appConfigService.setValues(paylods).then(async (res) => {
            await fetchData();
            return res;
        }).catch((err) => {
            LogService.error(err);
        });
    }


    return {
        dbAppConfig,
        viewAppConfig,
        groupedViewAppConfig,
        fetchData,
        getViewAppConfig,
        getDbAppConfig,
        saveAppConfig,
        saveModifiedAppConfig
    }
})
