import { BackupAndRecovery } from "@/core/models";
import { BackupAndRecoveryService, SettingsService } from "@/core/services";
import { deepParseString, serializeObject } from "@/core/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBackupAndRecoveryStore = defineStore("BackupAndRecoveryStore", () => {

    const backupFolderPathStr = ref<string | null>("");


    const dbData = ref<BackupAndRecovery[]>([]);

    const viewData = ref<BackupAndRecovery[]>([]);
    // 数据总数
    const dataCount = ref<number>(0);
    // 分页游标
    const currentPage = ref<number>(0);
    // 分页大小
    const pageSize = ref<number>(20);

    const fetchData = async () => {
        await fetchPageData();
        dataCount.value = await BackupAndRecoveryService.getDataCount();
        backupFolderPathStr.value = (await SettingsService.getSettingByKey('backupFolderPath'))?.selected as string ?? null;
    }

    const fetchPageData = async (cP: number = currentPage.value, pS: number = pageSize.value) => {
        dbData.value = await BackupAndRecoveryService.getPageData(cP, pS);
        viewData.value = deepParseString<BackupAndRecovery[]>(serializeObject(dbData.value)) ?? [];
    }


    return { viewData, dataCount, currentPage, pageSize, backupFolderPathStr, fetchData, fetchPageData };
})
