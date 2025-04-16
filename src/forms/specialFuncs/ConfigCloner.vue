<template>
    <div class="container">
        <el-card class="steam-users">
            <template #header>
                本机已登录的Steam账号
            </template>
            <template #default>
                <div class="users-container">
                    <el-card class="user-container" v-for="(v) in steamUserBasicInfo">
                        <div class="user-container-inner">
                            <div class="l">
                                <el-avatar class="avatar" shape="square" :src="v.avatarBase64" />
                            </div>
                            <div class="r select-text">
                                <div class="text">
                                    用户昵称:
                                    <CopyText :text="v.PersonaName" />
                                </div>
                                <div class="text">
                                    用户名称:
                                    <CopyText :text="v.AccountName" />
                                </div>
                                <div class="text">
                                    SteamID:
                                    <CopyText :text="v.steamId" />
                                </div>
                                <div class="text">
                                    FriendID:
                                    <CopyText :text="v.FriendId" />
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </template>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store/SettingsStore';
import VdfUtil from '@/utils/VdfUtil';
import { onMounted, ref } from 'vue';
import defAvatar from '@/assets/imgs/defAvatar.png';

import { invoke } from '@tauri-apps/api/core';
import CopyText from '@/components/Common/CopyText.vue';

const steamUserBasicInfo = ref<SteamUserBasicInfo[]>([]);

const SettingsStore = useSettingsStore()

const steamPath = SettingsStore.getDataByKeyName("steamInstallPath").value?.selected;


const getSteamLoginUsers = async () => {
    const vdfpath = `${steamPath}\\config\\loginusers.vdf`;
    // @ts-ignore
    const result: any = Object.entries((await VdfUtil.getVdfObjectbyFilePath(vdfpath)).users);
    result.forEach(async (v: any) => {
        const avatarpath = `${steamPath}\\config\\avatarcache\\${v[0]}.png`;
        // const rr = getUserDir(v[0])
        const obj = {
            PersonaName: v[1].PersonaName,
            AccountName: v[1].AccountName,
            steamId: v[0],
            FriendId: await linkUserDirToInfo(v[1].PersonaName),
            avatarBase64: await getUsersAvatar(avatarpath) || defAvatar
        }
        steamUserBasicInfo.value.push(obj)
    });
}


const linkUserDirToInfo = async (PersonaNameToFind: string): Promise<string> => {
    const res: any = await invoke("list_files_and_directories", { dirPath: `${steamPath}\\userdata` });
    const promises = res.children.map(async (v: any) => {
        const FriendID = v.name as string;
        const vdfpath = `${steamPath}\\userdata\\${FriendID}\\config\\localconfig.vdf`;
        const result: any = await VdfUtil.getVdfObjectbyFilePath(vdfpath);
        const PersonaNameOfDir = result.UserLocalConfigStore.friends.PersonaName;
        console.log("PersonaNameOfDir: " + PersonaNameOfDir);
        console.log("PersonaNameToFind: " + PersonaNameToFind);
        if (PersonaNameOfDir === PersonaNameToFind) {
            console.log("FriendID: " + FriendID);
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


onMounted(async () => {
    getSteamLoginUsers()
})

</script>

<style scoped lang="scss">
.steam-users {
    width: 100%;

    .users-container {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;

        .user-container {

            margin: calc($globe-margin /2);

            .user-container-inner {
                // width: $avatar-size;
                // height: calc($item-height /1.5);
                display: flex;
                flex-direction: row !important;
                flex-wrap: nowrap;

                .l {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .avatar {
                        width: calc($font-size * 5);
                        height: calc($font-size * 5);
                    }
                }

                .r {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: start;
                    padding-left: calc($globe-padding /4);

                    .text {
                        line-height: $font-size ;
                        width: 100%;
                    }
                }
            }

        }
    }
}
</style>