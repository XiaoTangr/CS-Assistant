<template>
    <div class="container">
        <el-card class="steam-users">
            <template #header>
                本机已登录的Steam账号
            </template>
            <template #default>
                <div class="users-container">
                    <el-card class="user-container" v-for="(v, k) in steamLoginUsers">
                        <div class="user-container-inner">
                            <div class="l">
                                <el-avatar class="avatar" shape="square" :src="defAvatar" />
                            </div>
                            <div class="r">
                                <div class="text">
                                    用户昵称: {{ v.PersonaName }}
                                </div>
                                <div class="text">
                                    用户名称: {{ v.AccountName }}
                                </div>
                                <div class="text">
                                    SteamID: {{ k }}
                                </div>
                                <div class="text">
                                    FriendID: {{ "null" }}
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

const steamLoginUsers = ref<Record<string, steamLoginUser>>()
const defAvatar = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
const SettingsStore = useSettingsStore()
const getSteamLoginUsers = async () => {
    const steamPath = SettingsStore.getDataByKeyName("steamInstallPath").value?.selected;
    const r = await VdfUtil.getVdfObjectbyFilePath(`${steamPath}\\config\\loginusers.vdf`);
    // @ts-ignore
    steamLoginUsers.value = r.users;
    console.log(steamLoginUsers.value)
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