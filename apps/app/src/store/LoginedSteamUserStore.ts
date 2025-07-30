import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "./SettingsStore";
import { Settings, BasicSteamLoginUser } from "@/core/models";
import { getVdfObjectByFilePath } from "@/core/utils/VdfUtils";
import LogUtil from "@/core/utils/LogUtil";
import { isFileExists, readFileAsBase64, searchFilesByName } from "@/core/utils/FsUtils";
export const useLoginedSteamUserStore = defineStore("LoginedSteamUserStore", () => {
    const SettingsStore = useSettingsStore();

    const data = ref<BasicSteamLoginUser[] | null>(null)
    const _localVdfsPathArr = ref<string[] | null>(null)
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
    const _loginedUsersVdfPath = `\\config\\loginusers.vdf`
    const _avatarsPath = `\\config\\avatarcache`


    const fetchData = async () => {
        ({ steamInstallPath: steamInstallPath.value, cs2InstallPath: cs2InstallPath.value } = await _getViewData());
        _localVdfsPathArr.value = await _getLocalVdfsPathArr();
        data.value = await _buildData();
    }

    const _getLocalVdfsPathArr = async (): Promise<Array<string> | null> => {
        const SEARCH_PATH = `${steamInstallPathStr.value}\\userdata`
        let res = await searchFilesByName(SEARCH_PATH, "localconfig.vdf")
        LogUtil.debug(res)
        return res;
    }

    const _matchAccountIdAndFriendId = async (targetPersonaName: string): Promise<string | null> => {
        if (!_localVdfsPathArr.value) return null;

        for (const item of _localVdfsPathArr.value) {
            try {
                const vdf = await getVdfObjectByFilePath(item);
                const personaName = vdf.UserLocalConfigStore?.friends?.PersonaName;

                if (personaName === targetPersonaName) {
                    const regex = /userdata[\\\/](\d+)/i;
                    const match = item.match(regex);

                    if (!match) {
                        return null;
                    }

                    const userId = match[1];
                    LogUtil.info(`[LoginedSteamUserStore] matchAccountIdAndFriendId: ${targetPersonaName} -> ${userId}`)
                    return userId;
                }
            } catch (error) {
                console.error(`Error processing file ${item}:`, error);
            }
        }

        return null;
    };



    const _buildData = async () => {
        let vdfPath = `${steamInstallPathStr.value}\\${_loginedUsersVdfPath}`
        if (!await isFileExists(vdfPath)) {
            LogUtil.debug(`[LoginedSteamUserStore] _buildData: ${vdfPath} not exists`)
            return null;
        }
        let preData = (await getVdfObjectByFilePath(vdfPath)).users
        let resultdata: BasicSteamLoginUser[] = await Promise.all(Object.keys(preData).map(async accountID => {
            let user = preData[accountID]
            return {
                AccountName: user.AccountName,
                PersonaName: user.PersonaName,
                steamId: accountID,
                FriendId: await _matchAccountIdAndFriendId(user.PersonaName),
                avatarBase64: (await _getAvatarDataUrl(accountID)),
            }
        }))


        LogUtil.debug(resultdata)

        return resultdata;
    }



    const _getAvatarDataUrl = async (accountID: string): Promise<string | null> => {
        const FILE_TYPE = ".png"
        let filePath = `${steamInstallPathStr.value}\\${_avatarsPath}\\${accountID}${FILE_TYPE}`
        let base64Str = await readFileAsBase64(filePath)
        return `data:image/png;base64,${base64Str}`
    }


    const _getViewData = async () => {
        let steamInstallPathData = SettingsStore.getViewDataItemByKey("steamInstallPath");
        let cs2InstallPathData = SettingsStore.getViewDataItemByKey("cs2InstallPath");

        LogUtil.debug("steamInstallPathData:", steamInstallPathData);
        LogUtil.debug("cs2InstallPathData:", cs2InstallPathData);

        return { steamInstallPath: steamInstallPathData, cs2InstallPath: cs2InstallPathData };
    }

    return { data, fetchData, steamInstallPath, cs2InstallPath, steamInstallPathStr, cs2InstallPathStr }
})