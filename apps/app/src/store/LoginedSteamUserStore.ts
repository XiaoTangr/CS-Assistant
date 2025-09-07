import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "./SettingsStore";
import { Settings, BasicSteamLoginUser } from "@/core/models";
import { getVdfObjectByFilePath } from "@/core/utils/VdfUtils";
import LogService from "@/core/services/Log.service";
import { isFileExists, readFileAsBase64, searchFilesByName } from "@/core/utils/FsUtils";
import { watch } from "vue";
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

    watch(cs2InstallPathStr, () => {
        fetchData();
    })

    const fetchData = async () => {
        ({ steamInstallPath: steamInstallPath.value, cs2InstallPath: cs2InstallPath.value } = await _getViewData());
        _localVdfsPathArr.value = await _getLocalVdfsPathArr();
        data.value = await _buildData();
    }

    const _getLocalVdfsPathArr = async (): Promise<Array<string> | null> => {
        const SEARCH_PATH = `${steamInstallPathStr.value}\\userdata`
        let res = await searchFilesByName(SEARCH_PATH, "localconfig.vdf")
        return res;
    }

    const _matchAccountIdAndFriendId = async (targetPersonaName: string): Promise<number | null> => {
        if (!_localVdfsPathArr.value) {
            throw new Error(`[LoginedSteamUserStore] _getLocalVdfsPathArr: steamInstallPathStr.value is null`);
        };

        for (const item of _localVdfsPathArr.value) {
            try {
                const vdf = await getVdfObjectByFilePath(item);
                const personaName = vdf.UserLocalConfigStore?.friends?.PersonaName;

                if (personaName === targetPersonaName) {
                    const regex = /userdata[\\\/](\d+)/i;
                    const match = item.match(regex);

                    if (!match) {
                        LogService.warn(`[LoginedSteamUserStore._matchAccountIdAndFriendId] `, `match result: ${targetPersonaName} -> null`)
                        return null;
                    }

                    const userId = match[1] ?? 0;
                    LogService.info(`[LoginedSteamUserStore._matchAccountIdAndFriendId] `, `match result: ${targetPersonaName} -> ${userId}`)
                    return parseInt(userId);
                }
            } catch (error) {
                LogService.error(`Error processing file ${item}:`, error);
            }
        }

        return null;
    };



    const _buildData = async () => {
        let vdfPath = `${steamInstallPathStr.value}\\${_loginedUsersVdfPath}`
        if (!await isFileExists(vdfPath)) {
            LogService.warn(`[LoginedSteamUserStore] _buildData: ${vdfPath} not exists`)
            return null;
        }
        let preData = (await getVdfObjectByFilePath(vdfPath)).users
        let resultdata: BasicSteamLoginUser[] = (await Promise.all(Object.keys(preData).map(async accountID => {
            let user = preData[accountID]
            let FriendId = await _matchAccountIdAndFriendId(user.PersonaName);
            let avatarBase64 = (await _getAvatarDataUrl(accountID))
            let res: BasicSteamLoginUser | null = null;
            if (FriendId && avatarBase64) {
                res = {
                    AccountName: user.AccountName,
                    PersonaName: user.PersonaName,
                    steamId: parseInt(accountID),
                    FriendId: FriendId,
                    avatarBase64: avatarBase64
                }
            }
            return res;
        }))).filter((item): item is BasicSteamLoginUser => item !== null); // 过滤掉 null 值并确保类型正确
        LogService.info('[LoginedSteamUserStore._buildData]', resultdata)
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
        return { steamInstallPath: steamInstallPathData, cs2InstallPath: cs2InstallPathData };
    }


    /**
    * 根据任意提供信息获取该用户的其他信息
    * @param { personaName,steamId,accountName,friendId} - 用户的任一信息,均为可选，但必须提供至少一个
    * @returns 返回一个包含用户信息的对象
    */
    const getLogedSteamUser = async ({
        personaName,
        steamId,
        accountName,
        friendId
    }: {
        personaName?: string;
        steamId?: number;
        accountName?: string;
        friendId?: number;
    }): Promise<BasicSteamLoginUser | null> => {
        // 确保至少提供一个参数
        if (!personaName && !steamId && !accountName && (friendId === undefined || friendId === null)) {
            LogService.warn('[LoginedSteamUserStore.getLogedSteamUser] 至少需要提供一个用户信息参数');
            return null;
        }

        // 确保数据已加载
        if (!data.value) {
            await fetchData();
        }

        // 如果仍然没有数据，返回null
        if (!data.value) {
            return null;
        }

        // 根据提供的参数查找用户
        const user = data.value.find(u => {
            // 检查PersonaName
            if (personaName && u.PersonaName == personaName) {
                return true;
            }
            // 检查steamId
            if (steamId && u.steamId == steamId) {
                return true;
            }
            // 检查AccountName
            if (accountName && u.AccountName == accountName) {
                return true;
            }
            // 检查FriendId
            if (friendId !== undefined && friendId !== null && u.FriendId == friendId) {
                return true;
            }
            return false;
        });
        return user || null;
    }

    return { data, steamInstallPath, cs2InstallPath, steamInstallPathStr, cs2InstallPathStr, fetchData, getLogedSteamUser }
})
