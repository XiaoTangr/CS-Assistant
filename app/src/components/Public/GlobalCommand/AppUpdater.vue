<template>
    <el-tooltip v-if="hasUpdate" content="有新版本可用，点击查看！">
        <GlassButton type="danger" size="large" round plain @click="showByHandler">
            New!
        </GlassButton>
    </el-tooltip>

    <GlassDialog destroy-on-close v-model="showDialog">
        <template #header>
            <h3 class="text-lg">发现新版本！</h3>
        </template>
        <template #default>
            <div class="dialog-content">
                <span class="dialog-content-item">当前版本:v{{ updater_remoteData.currentVersion }}</span>
                <span class="dialog-content-item">最新版本:{{ updater_remoteData_fullVersion }}</span>
                <GlassButton class="dialog-content-item" @click="readUpdateNoteHandler" type="primary" link> 点击查看更新日志
                </GlassButton>
                <el-checkbox @change="showUpdateDialogChangeHandler" v-model="showUpdateDialog"
                    class="dialog-content-item" label="有更新时通知我" />
            </div>
        </template>
        <template #footer>
            <CommSpace direction="horizontal" :fill-ratio="20">
                <GlassButton @click="closeDialogHandler" round plain> 下次一定 </GlassButton>
                <GlassButton @click="openDownloadUrlHandler(item)" round type="primary" plain
                    v-for="(item, index) in platforms">
                    {{ `为 ${index} 下载` }}
                </GlassButton>
            </CommSpace>
        </template>
    </GlassDialog>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/AppStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { openUrl } from '@tauri-apps/plugin-opener';
import { useAppConfigStore } from '@/store/appConfigStore';
import { AppConfig } from '@/core/models';
import { KeyValueService } from '@/core/services';
import { ElNotification } from 'element-plus';
const appStore = useAppStore();
const appConfigStore = useAppConfigStore();
const { updater_remoteData, updater_showDialog, updater_remoteData_fullVersion } = storeToRefs(appStore);

const showDialog = ref(false)


const fromDbShowUpdateDialog = ref<AppConfig | null>();
const showUpdateDialog = ref(false)

const fromDbUseDevVersion = ref<AppConfig | null>();


const hasUpdate = computed(() => {
    if (updater_remoteData.value) {
        if (fromDbUseDevVersion.value?.value && updater_remoteData_fullVersion.value.startsWith('dev')) {
            // 显示dev更新
            return true
        } else {
            return updater_remoteData_fullVersion.value.startsWith('v')
        }
    } else {
        return false
    }


})

const platforms = computed(() => {
    return updater_remoteData.value.rawJson.platforms;
});
const showByHandler = () => {
    showDialog.value = true;
};

onMounted(async () => {

    // 设置->使用测试版
    fromDbUseDevVersion.value = await appConfigStore.getViewAppConfig('getDevVersion')
    // 设置->显示更新提示
    fromDbShowUpdateDialog.value = await appConfigStore.getViewAppConfig('showUpdateDialog');
    showUpdateDialog.value = fromDbShowUpdateDialog.value?.value;


    await appStore.checkUpdate();
    if (hasUpdate.value && updater_showDialog.value) {
        showDialog.value = true;
    }
});

const readUpdateNoteHandler = async () => {
    let kvSer = KeyValueService.getInstance()
    let gitUrl = await kvSer.getValue("App_Github")
    if (!gitUrl) {
        ElNotification.error({
            title: "错误",
            message: "请先配置Github地址",
        });
    }
    gitUrl = `${gitUrl}/releases`
    await openUrl(gitUrl);
}
const openDownloadUrlHandler = (event: any) => {
    openUrl(event.url);
}

const closeDialogHandler = async () => {
    showDialog.value = false;
}

const showUpdateDialogChangeHandler = async (value: any) => {
    // TODO: 待完善
}

</script>

<style scoped lang="scss">
.container {
    display: none;
}

.dialog-content {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    .dialog-content-item {
        margin: 0;
        padding: 0;
        padding-top: .5rem;
    }

    .dialog-content-item:first-child {
        padding-top: 0;
    }
}
</style>
