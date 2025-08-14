<template>
    <GlassCard shadow="never" class="container">
        <template #header> 配置文件克隆器 </template>
        <template #default>
            <div class="body-container">
                <el-space class="selecter" direction="vertical" fill>
                    <div class="l">
                        <p>复制源</p>
                        <el-select clearable v-model="cloneFrom" placeholder="选择复制源" style="flex: 1;"
                            @change="cloneFromSelecterChangeHandler">
                            <el-option v-for="item in selectList" :disabled="!item.asOrigin" :key="item.folderName"
                                :label="item.userName" :value="item.folderName?.toString()" />
                        </el-select>
                    </div>
                    <div class="r">
                        <p>目标(可多选)</p>
                        <el-select clearable v-model="cloneTo" multiple placeholder="选择复制目标" style="flex: 1;">
                            <el-option v-for="item in selectList" :disabled="!item.asTarget" :key="item.folderName"
                                :label="item.userName" :value="item.folderName?.toString()" />
                        </el-select>
                    </div>
                </el-space>

                <el-space class="operaters">
                    <el-checkbox v-model="backupUserSettings" label="备份目标的配置文件" />
                    <GlassButton round type="primary" @click="confirmCloneHandler">确定</GlassButton>
                </el-space>
            </div>
        </template>
    </GlassCard>
</template>

<script setup lang="ts">

import GlassButton from '@/components/Common/GlassButton.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import { ConfigCloneService } from '@/core/services';
import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { ElNotification } from 'element-plus';

import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue'


interface SettingsArrItem {
    userName: string | undefined,
    folderName: number | undefined,
    asOrigin: boolean,
    asTarget: boolean,
}

const backupUserSettings = ref(true)
const LoginedSteamUserStore = useLoginedSteamUserStore();

const { data: LoginedSteamUsers } = storeToRefs(LoginedSteamUserStore);

// 选择列表
const selectList = ref<SettingsArrItem[]>();

// 复制源
const cloneFrom = ref<number>();

// 目标列表
const cloneTo = ref<number[]>([]);


const cloneFromSelecterChangeHandler = (value: number) => {
    cloneTo.value = cloneTo.value.filter((item: number) => item !== value);
    selectList.value?.forEach((item: SettingsArrItem) => {

        if (item.folderName == value) {
            item.asOrigin = false;
            item.asTarget = false;
        } else {
            item.asOrigin = true;
            item.asTarget = true;
        }
    })
}

onMounted(() => {
    if (LoginedSteamUsers.value) {
        selectList.value = LoginedSteamUsers.value.map((item) => ({
            userName: item.PersonaName ?? undefined,
            folderName: item.FriendId ?? undefined,
            asOrigin: true,
            asTarget: true
        }));
    }
})

const confirmCloneHandler = async () => {
    if (!cloneFrom.value || cloneTo.value.length === 0) {
        ElNotification.error({
            title: '错误',
            message: '未指定复制源或目标',
            type: 'error',
            duration: 3000,
        });
        return;
    }
    if (cloneTo.value.includes(cloneFrom.value)) {
        ElNotification.error({
            title: '错误',
            message: '目标列表中不能包含复制源',
            type: 'error',
            duration: 3000,
        });
        return;
    }
    await ConfigCloneService.cloneConfig(cloneFrom.value, cloneTo.value).then(() => {
        ElNotification.success({
            title: '成功',
            message: '配置克隆成功',
            type: 'success',
            duration: 3000,
        });
        // 清空选择
        cloneFrom.value = undefined;
        cloneTo.value = [];
        selectList.value?.forEach((item) => {
            item.asOrigin = true;
            item.asTarget = true;
        });
    }).catch((error: Error) => {
        ElNotification.error({
            title: '错误',
            message: error.message,
            type: 'error',
            duration: 5000
        });
    });
}



</script>

<style lang="scss" scoped>
.body-container {
    display: flex;
    flex-direction: column;

    .selecter {
        width: 100%;

        .l,
        .r {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }

    .operaters {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }

    .selecter,
    .operaters {
        padding: calc($globe-padding / 2);
    }
}
</style>
