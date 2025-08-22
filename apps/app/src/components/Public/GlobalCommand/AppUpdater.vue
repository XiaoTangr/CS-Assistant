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
import { LogServices } from '@/core/services';
import { openUrl } from '@tauri-apps/plugin-opener';
import { useMapStore } from '@/store/MapStore';
import { useSettingsStore } from '@/store/SettingsStore';
import { Settings } from '@/core/models';
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const { updater_remoteData, updater_showDialog, updater_remoteData_fullVersion } = storeToRefs(appStore);

const showDialog = ref(false)


const fromDbShowUpdateDialog = ref<Settings | any>();
const showUpdateDialog = ref(false)

const fromDbUseDevVersion = ref<Settings | any>();


const hasUpdate = computed(() => {
    if (updater_remoteData.value) {
        if (fromDbUseDevVersion.value.selected && updater_remoteData_fullVersion.value.startsWith('dev')) {
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
    fromDbUseDevVersion.value = settingsStore.getDbDataItemByKey('getDevVersion')
    // 设置->显示更新提示
    fromDbShowUpdateDialog.value = settingsStore.getDbDataItemByKey('showUpdateDialog');
    showUpdateDialog.value = fromDbShowUpdateDialog.value.selected;


    await appStore.checkUpdate();
    LogServices.debug('updater_remoteData', updater_remoteData.value);
    if (hasUpdate.value && updater_showDialog.value) {
        showDialog.value = true;
    }
});

const readUpdateNoteHandler = async () => {
    let gitUrl = await useMapStore().getValueByKey("App_Github")
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

    fromDbShowUpdateDialog.value.selected = value;
    settingsStore.saveOneData(fromDbShowUpdateDialog.value).then(async () => {
        await settingsStore.fetchData()
    })
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
        padding-top: .5em;
    }

    .dialog-content-item:first-child {
        padding-top: 0;
    }
}
</style>
