import { BackupAndRecovery } from "@/core/models";
import { BackupAndRecoveryService, LogServices } from "@/core/services";
import { deepParseString, getCurrentTimestamp, serializeObject, timestampToFolderName } from "@/core/utils";
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
        viewData.value = deepParseString<BackupAndRecovery[]>(serializeObject(dbData.value)) ?? [];
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
        createdAt: -1
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
        confirmCreateBackupData.value.createdAt = timeStamp;
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
        LogServices.debug("新的数据", confirmCreateBackupData.value)
    }, {
        deep: true
    })

    const createBackup = async () => {

        // -1 表示数据不完整
        if (confirmCreateBackupData.value.nickName.trim() === '') {
            throw -1;
        }
        try {
            LogServices.debug("[ConfigCloneService.cloneConfig] 创建备份开始...", confirmCreateBackupData.value)
            return await BackupAndRecoveryService.createBackup(confirmCreateBackupData.value)
        } catch (error) {
            LogServices.error(error);
            throw error;
        }
    }


    return { confirmCreateBackupData, setConfirmCreateBackupData, createBackup, loginedSteamUserData, viewData, dataCount, currentPage, pageSize, fetchData, fetchPageData };
})
