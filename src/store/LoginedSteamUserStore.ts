import { defineStore } from "pinia";
import { ref } from "vue";
import { useSettingsStore } from "./SettingsStore";
import { invoke } from "@tauri-apps/api/core";
import { getVdfObjectByFilePath } from "@/core/utils/VdfUtil";
import defAvatar from '@/assets/imgs/defAvatar.png';
import { watch } from "vue";
import { SteamUserBasicInfo } from "@/core/types/types";

export const useLoginedSteamUserStore = defineStore("LoginedSteamUserStore", () => {
    // const data = ref<SteamUserBasicInfo[]>([]);

    const data = ref<SteamUserBasicInfo[]>()

    const SettingsStore = useSettingsStore();
    const steamPath = ref();


    watch(SettingsStore, () => {
        // data.value = undefined;
        getLoginedSteamUsers();
    })

    const getLoginedSteamUsers = async () => {
        console.log(SettingsStore.qetSettingsByKey("steamInstallPath"));
        steamPath.value = SettingsStore.qetSettingsByKey("steamInstallPath")?.selected;
        const vdfpath = `${steamPath.value}\\config\\loginusers.vdf`;
        // @ts-ignore
        let result = Object.entries((await getVdfObjectByFilePath(vdfpath).finally(() => { data.value = undefined })).users)
        data.value = [];
        result.forEach(async (v: any) => {
            const avatarpath = `${steamPath.value}\\config\\avatarcache\\${v[0]}.png`;
            const obj: SteamUserBasicInfo = {
                PersonaName: v[1].PersonaName,
                AccountName: v[1].AccountName,
                steamId: v[0],
                FriendId: await linkUserDirToInfo(v[1].PersonaName),
                avatarBase64: await getUsersAvatar(avatarpath) || defAvatar
            }
            data.value?.push(obj);
        });
    }


    const linkUserDirToInfo = async (PersonaNameToFind: string): Promise<string> => {
        const res: any = await invoke("list_files_and_directories", { dirPath: `${steamPath.value}\\userdata` });
        const promises = res.children.map(async (v: any) => {
            const FriendID = v.name as string;
            const vdfpath = `${steamPath.value}\\userdata\\${FriendID}\\config\\localconfig.vdf`;
            const result: any = await getVdfObjectByFilePath(vdfpath);
            const PersonaNameOfDir = result.UserLocalConfigStore.friends.PersonaName;
            if (PersonaNameOfDir === PersonaNameToFind) {
                return FriendID;
            }
            return null;
        });

        const results = await Promise.all(promises);
        return results.find((id) => id !== null) || null;
    };

    const getUsersAvatar = async (avatarpath: string) => {

        if (!await invoke("is_file_exists", { filepath: avatarpath })) {
            return defAvatar
        }

        const binaryData: ArrayBuffer = await invoke("read_file", { path: avatarpath })
        // 将二进制数据转换为Base64编码
        const base64String = btoa(
            new Uint8Array(binaryData).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        return `data:image/png;base64,${base64String}`
    }

    const fetchData = async () => {
        await getLoginedSteamUsers();
    }
    return { data, fetchData }
})