<template>
    <GlassCard shadow="never" class="container">
        <div class="group">
            <GlassCard body-class="item-body" shadow="hover" :class="[{ 'not-install': !hasSteam }, `card`]">
                <div class="title">Steam</div>
                <div v-if="hasSteam" class="content">
                    位于:<br>
                    <CopyText :value="steamInstallPathStr as string" />
                </div>
                <div v-else class="content">
                    <GlassButton type="primary" size="large" round plain @click="setPath">指定Steam安装位置</GlassButton>
                </div>
            </GlassCard>
            <GlassCard body-class="item-body" shadow="hover" :class="[{ 'not-install': !hasCS }, `card`]">
                <div class="title">Counter Strike</div>
                <div v-if="hasCS" class="content">
                    位于:<br>
                    <CopyText :value="cs2InstallPathStr as string" />
                </div>
                <div v-else class="content">
                    指定Steam路径后自动识别!
                </div>
            </GlassCard>
        </div>
    </GlassCard>

</template>
<script setup lang="ts">
import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { computed, onMounted } from 'vue';
import { selectFilePath, isFileExists } from '@/core/utils/FsUtils';
import { getVdfObjectByFilePath } from '@/core/utils/VdfUtils';
import { ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import GlassButton from '@/components/Common/GlassButton.vue';
import CopyText from '@/components/Common/CopyText.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import { useAppConfigStore } from '@/store';
const STEAM_EXE_PATH_WINDOWS = "\\steam.exe"
const STEAM_LIBRARY_GAME_SAVE_PATH = "\\steamapps\\common"
const STEAM_LIBRARY_VDFNAME = "libraryfolders.vdf"
const MAIN_STEAMLIBRARY_VDF = `\\config\\${STEAM_LIBRARY_VDFNAME}`

const CS_HOME = `${STEAM_LIBRARY_GAME_SAVE_PATH}\\Counter-Strike Global Offensive`
const CS_ID = 730
const CS_EXE_PATH_WINDOWS = `${CS_HOME}\\game\\bin\\win64\\cs2.exe`


const appConfigStore = useAppConfigStore();
const LoginedSteamUserStore = useLoginedSteamUserStore();

const { steamInstallPath, cs2InstallPath, steamInstallPathStr, cs2InstallPathStr } = storeToRefs(LoginedSteamUserStore)

const hasSteam = computed(() => {
    let str = steamInstallPath.value?.value as string ?? null;
    return str ? true : false;
})

const hasCS = computed(() => {
    let str = cs2InstallPath.value?.value as string ?? null;
    return str ? true : false;
})


/**
 * 检测并自动更新数据
 * @returns void
 */
const autoCheck = async (): Promise<void> => {
    const _isSteamExists = async () => {
        return await isFileExists(`${steamInstallPathStr.value}${STEAM_EXE_PATH_WINDOWS}`);
    }
    const _isCSExists = async () => {
        return await isFileExists(cs2InstallPathStr.value as string);
    }
    if (await _isSteamExists()) {
        if (!(await _isCSExists())) {
            let csExePath = await getCSInstallPathByVdf();
            if (csExePath) {
                if (cs2InstallPath.value) {
                    cs2InstallPath.value.value = csExePath;
                }
                await appConfigStore.saveAppConfig('cs2InstallPath');
            } else {
                ElNotification.error({
                    title: '错误',
                    message: '未找到cs2.exe!',
                });
                return;
            }
        }
    } else {
        if (steamInstallPath.value) {
            steamInstallPath.value.value = '';
        }
        if (cs2InstallPath.value) {
            cs2InstallPath.value.value = '';
        }
        await appConfigStore.saveAppConfig('steamInstallPath')
        await appConfigStore.saveAppConfig('cs2InstallPath')
    }
}

/**
 * 选择Steam安装路径
 * @returns Steam安装路径 | null
 */
const selectSteamInstallPath = async (): Promise<string | null> => {
    const { directoryPath: steamExePath, filePath } = await selectFilePath('steam.exe', ["exe"]);
    if (!await isFileExists(filePath as string)) {
        return null;
    }
    return steamExePath;
}

/**
 * 设置Steam安装路径
 */
const setPath = async (): Promise<void> => {
    let steamExePath = await selectSteamInstallPath();
    if (!steamExePath) {
        ElNotification.error({
            title: '错误',
            message: '选择的路径不存在steam.exe!',
        });
        return;
    }
    if (steamInstallPath.value) {
        steamInstallPath.value.value = steamExePath;
    }
    let csExePath = await getCSInstallPathByVdf();
    if (!csExePath) {
        ElNotification.error({
            title: '错误',
            message: '未找到cs2.exe!',
        });
        return;
    }
    if (cs2InstallPath.value) {
        cs2InstallPath.value.value = csExePath;
    }
    await appConfigStore.saveAppConfig("steamInstallPath");
}
/**
 * 通过vdf获取 CS2 安装路径
 * @returns CS2 安装路径 | null
 */
const getCSInstallPathByVdf = async (): Promise<string | null> => {
    if (!steamInstallPathStr.value) return null;
    const steamLibraryVdfPath = `${steamInstallPathStr.value}${MAIN_STEAMLIBRARY_VDF}`;
    const vdfObj = await getVdfObjectByFilePath(steamLibraryVdfPath);
    if (!vdfObj?.libraryfolders) return null;
    const libraries = Object.values(vdfObj.libraryfolders) as Array<{
        path: string;
        apps: Record<string, any>;
    }>;
    const libraryWithCS = libraries.find(library =>
        library.apps && (CS_ID.toString() in library.apps)
    );
    if (!libraryWithCS) return null;
    const csPath = `${libraryWithCS.path}${CS_EXE_PATH_WINDOWS}`;
    return await isFileExists(csPath) ? `${libraryWithCS.path}${CS_HOME}` : null;
}
onMounted(async () => {
    steamInstallPath.value = await appConfigStore.getViewAppConfig("steamInstallPath");
    cs2InstallPath.value = await appConfigStore.getViewAppConfig("cs2InstallPath");
    await autoCheck();
});

</script>

<style scoped lang="scss">
@use "sass:color";

.container {
    width: 100%;
    height: 100%;

    .group {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
    }



    :deep(.item-body) {
        padding: 4px;
        overflow: hidden;
        overflow-y: auto;
        margin: 0;
    }

    .card:first-child {
        margin-bottom: 0;
    }

    .card {
        flex: 1;
        margin: $globe-margin;
        background-color: $success-color-alpha-3;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        border: $simple-border;
        padding: $globe-padding;
        border-radius: $globe-border-radius;

        .title {
            padding-bottom: calc($globe-padding / 2);
            font-size: 1.1rem;
            font-weight: bold;
        }
    }

    .not-install {
        background-color: $danger-color-alpha-3 !important;
    }


}
</style>
