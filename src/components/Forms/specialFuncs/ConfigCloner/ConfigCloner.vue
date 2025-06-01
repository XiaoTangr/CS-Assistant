<template>
    <el-card class="container">
        <template #header> 配置文件克隆器 </template>
        <template #default>
            <div class="body-container">
                <el-space class="selecter" direction="vertical" fill>
                    <div class="l">
                        <p>复制源</p>
                        <el-select v-model="CopyOriginSelected" placeholder="选择复制源" style="flex: 1;"
                            @change="asOrigintSelerterChangeHandler">
                            <el-option v-for="item in userSettingsArr" :disabled="!item.asOrigin" :key="item.folderName"
                                :label="item.userName" :value="item.folderName" />
                        </el-select>
                    </div>
                    <div class="r">
                        <p>目标(可多选)</p>

                        <el-select v-model="CopyTargetSelected" multiple placeholder="选择复制目标" style="flex: 1;">
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

<script setup lang="ts">
import { SettingsDO } from '@/DBA/DO/SettingsDO';
import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { useSettingsStore } from '@/store/SettingsStore';
import { ElMessageBox, ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue'
import {  useRouter } from 'vue-router';

const router = useRouter();

const SettingsStore = useSettingsStore();

interface SettingsArrItem {
    userName: string,
    folderName: string,
    asOrigin: boolean,
    asTarget: boolean,
}
const backupUserSettings = ref(true)
const LoginedSteamUserStore = useLoginedSteamUserStore();


const buckupFolderPath = ref<string>();

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
const getBackupFolderPath = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        let r = SettingsStore.getDataByKeyName("backupFolderPath").value as SettingsDO;
        if (!r || !r.selected || r.selected === '') {
            reject("The value of backupFolderPath is empty or illegal! ");
        }
        resolve(r.selected as string);
    })
}

const copyHandler = async () => {


    if (!CopyOriginSelected.value || CopyTargetSelected.value.length === 0) {
        ElNotification.error({ message: '请选择复制源和目标' });
        return;
    }
    if (backupUserSettings.value) {
        try {
            // 获取备份文件夹路径
            buckupFolderPath.value = await getBackupFolderPath();
            await ElMessageBox.alert(`备份 ${CopyTargetSelected.value.join(', ')} 的配置文件到 ${buckupFolderPath.value}`, '提示').then(() => {
                ElNotification.info('OK')
            }).catch(() => {
                ElNotification.info('cancel')
            })
        } catch (e: any) {
            ElNotification.error(`error:${e},请前往设置页设置备份文件夹路径。`);
            router.push({ path: '/appSettings/PathSettings' });
            return;
        }
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