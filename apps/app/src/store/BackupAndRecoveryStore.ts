import { BackupAndRecovery } from "@/core/models";
import { BackupAndRecoveryService, LogService } from "@/core/services";
import { getCurrentTimestamp, json5, timestampToFolderName } from "@/core/utils";
import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useLoginedSteamUserStore } from "./LoginedSteamUserStore";

export const useBackupAndRecoveryStore = defineStore("BackupAndRecoveryStore", () => {

    const LoginedSteamUserStore = useLoginedSteamUserStore();

    const { data: loginedSteamUserData } = storeToRefs(LoginedSteamUserStore);


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
    }

    const fetchPageData = async (cP: number = currentPage.value, pS: number = pageSize.value) => {
        dbData.value = await BackupAndRecoveryService.getPageData(cP, pS);
        viewData.value = json5.deepParse<BackupAndRecovery[]>(json5.stringify(dbData.value)) ?? [];
    }

    const pathGenerator = async (fid: number, timePath: string) => {
        let path = await BackupAndRecoveryService.getBackupFolderPath();
        return `${path}\\${fid}\\${timePath}\\730`;
    }

    // ——————————————— 新建备份 ————————————————————

    // 新建备份操作数据
    const confirmCreateBackupData = ref<BackupAndRecovery>({
        id: -1,
        nickName: '',
        friendId: -1,
        description: '',
        folderPath: '',
    })
    /**
     * 设置新建备份操作数据的时间戳
     * @param config 配置对象
     * @param config.reset 是否重置时间戳 可选 默认为 false
     */
    const setConfirmCreateBackupData = (config?: { reset?: boolean }) => {
        let timeStamp = getCurrentTimestamp();
        if (config?.reset) {
            timeStamp = -1;
            confirmCreateBackupData.value.nickName = '';
            confirmCreateBackupData.value.description = '';
            confirmCreateBackupData.value.folderPath = '';
        }
        confirmCreateBackupData.value.id = timeStamp;
    }

    // 更新fid和folderPath
    watch(confirmCreateBackupData.value, async (newValue, oldValue) => {

        let newNickName = newValue.nickName;
        let oldId = oldValue.id;
        let fid: number = (loginedSteamUserData.value ?? []).find(item => item.PersonaName === newNickName)?.FriendId as unknown as number;
        let folderPath = '';
        if (newNickName != '') {
            folderPath = await pathGenerator(fid, timestampToFolderName(oldId))
        }
        confirmCreateBackupData.value.friendId = fid;
        confirmCreateBackupData.value.folderPath = folderPath;
    }, {
        deep: true
    })

    const createBackup = async () => {

        // -1 表示数据不完整
        if (confirmCreateBackupData.value.nickName.trim() === '') {
            throw -1;
        }
        try {
            LogService.info("[ConfigCloneService.cloneConfig] 为以下数据创建备份: ", confirmCreateBackupData.value)
            return await BackupAndRecoveryService.createBackup(confirmCreateBackupData.value)
        } catch (error) {
            LogService.error(error);
            throw error;
        }
    }


    return { confirmCreateBackupData, setConfirmCreateBackupData, createBackup, loginedSteamUserData, viewData, dataCount, currentPage, pageSize, fetchData, fetchPageData };
})
