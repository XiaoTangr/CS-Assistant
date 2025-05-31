<template>
    <el-card class="container">
        <template #header> 配置文件克隆器 </template>
        <template #default>
            <div class="body-container">
                <el-space class="selecter" direction="vertical" fill>
                    <div class="l">
                        <p>复制源</p>
                        <el-select v-model="CopyOriginSelected" placeholder="Select" style="flex: 1;"
                            @change="asOrigintSelerterChangeHandler">
                            <el-option v-for="item in userSettingsArr" :disabled="!item.asOrigin" :key="item.folderName"
                                :label="item.userName" :value="item.folderName" />
                        </el-select>
                    </div>
                    <div class="r">
                        <p>目标(可多选)</p>

                        <el-select v-model="CopyTargetSelected" multiple placeholder="Select" style="flex: 1;">
                            <el-option v-for="item in userSettingsArr" :disabled="!item.asTarget" :key="item.folderName"
                                :label="item.userName" :value="item.folderName" />
                        </el-select>
                    </div>
                </el-space>

                <el-space class="operaters">
                    <el-checkbox v-model="backupUserSettings" label="备份目标的配置文件" />
                    <el-button type="primary" @click="copyHandler">确定</el-button>
                </el-space>
            </div>
        </template>
    </el-card>
</template>

<script setup lang="ts">import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { ElMessageBox, ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue'

const backupUserSettings = ref(true)

const LoginedSteamUserStore = useLoginedSteamUserStore();

interface SettingsArrItem {
    userName: string,
    folderName: string,
    asOrigin: boolean,
    asTarget: boolean,
}

const { data } = storeToRefs(LoginedSteamUserStore);
const userSettingsArr = ref<Array<SettingsArrItem>>();


const CopyOriginSelected = ref<string | undefined>();
const CopyTargetSelected = ref<string[]>([]);

onMounted(() => {
    userSettingsArr.value = data.value?.map((item) => {
        return { userName: item.PersonaName, folderName: item.FriendId, asOrigin: true, asTarget: true }
    })
})

const asOrigintSelerterChangeHandler = (value: string) => {
    if (CopyTargetSelected.value.includes(value)) {
        CopyTargetSelected.value = CopyTargetSelected.value.filter((item) => item !== value);
    }
    userSettingsArr.value?.forEach((item) => {
        if (item.folderName === value) {
            item.asTarget = false;
        } else {
            item.asTarget = true;
        }
    })
}

const copyHandler = () => {
    if (!CopyOriginSelected.value || CopyTargetSelected.value.length === 0) {
        ElNotification.error({ message: '请选择复制源和目标' });
        return;
    }
    ElMessageBox.alert(`复制 ${CopyOriginSelected.value} 的配置到 ${CopyTargetSelected.value.join(' , ')} `, '提示').then(() => {
        ElNotification.info('OK')
    }).catch(() => {
        ElNotification.info('cancel')
    })
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