<template>
    <el-card class="steam-users">
        <template #header>
            本机已登录的Steam账号:{{ data?.length }}
            (部分账号再次登录可能需要授权)
        </template>
        <template #default>
            <el-space wrap :fill-ratio="1" class="users-container">
                <el-card class="user-container" v-for="(v) in data as any">
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
                <el-empty :description="description" v-if="data === undefined">
                    <el-button type="primary" :icon="RefreshRight" @click="getSteamLoginUsers" />
                </el-empty>
            </el-space>
        </template>
    </el-card>
</template>

<script setup lang="ts">
import CopyText from '@/components/Public/CopyText.vue';
import { RefreshRight } from '@element-plus/icons-vue';
import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const LoginedSteamUserStore = useLoginedSteamUserStore();

const { data } = storeToRefs(LoginedSteamUserStore);

const description = computed(() => {
    return data.value === undefined ? '无法获取Steam登录用户信息,检查Steam安装路径是否正确设置' : '似乎Steam还未登录过用户,请先登录';
})


const getSteamLoginUsers = async () => {
    LoginedSteamUserStore.fetchData();
}

</script>

<style scoped lang="scss">
.steam-users {
    width: 100%;

    .users-container {
        display: flex;
        // width: 100%;
        flex-wrap: wrap;
        justify-content: center;

        .user-container {

            // margin: calc($globe-margin /2);

            .user-container-inner {
                // width: $avatar-size;
                // height: calc($item-height /1.5);
                display: flex;
                // flex-direction: row !important;
                // flex-wrap: nowrap;

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