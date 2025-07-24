<template>

    <el-card class="container" style="overflow: hidden; display:flex;flex-direction:column;flex: 1;"
        :body-style="{ flex: 1, padding: '0px' }">
        <el-space fill wrap alignment="stretch" class="inner-container">
            <GlassCard :class="[{ 'not-install': !hasSteam }, `card`]">
                <div class="title">Steam</div>
                <div v-if="hasSteam" class="content">
                    位于:<br>
                    <CopyText :text="steamInstallPathStr as string" />
                </div>
                <div v-else class="content">
                    <GlassButton size="large" round @click="setPath">查找Steam</GlassButton>
                </div>
            </GlassCard>
            <GlassCard :class="[{ 'not-install': !hasCS }, `card`]">
                <div class="title">Counter Strike</div>
                <div v-if="hasCS" class="content">
                    位于:<br>
                    <CopyText :text="cs2InstallPathStr as string">
                        {{ cs2InstallPathStr }}
                    </CopyText>
                </div>
                <div v-else class="content">
                    指定Steam路径后自动识别!
                </div>
            </GlassCard>
        </el-space>
    </el-card>

</template>

<script setup lang="ts">
import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { useSettingsStore } from '@/store/SettingsStore';
import { computed, onMounted } from 'vue';
import { selectFilePath, isFileExists } from '@/core/utils/FsUtils';
import { getVdfObjectByFilePath } from '@/core/utils/VdfUtils';
import { ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import GlassButton from '@/components/Common/GlassButton.vue';
import CopyText from '@/components/Common/CopyText.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
const STEAM_EXE_PATH_WINDOWS = "\\steam.exe"
const STEAM_LIBRARY_GAME_SAVE_PATH = "\\steamapps\\common"
const STEAM_LIBRARY_VDFNAME = "libraryfolders.vdf"
const MAIN_STEAMLIBRARY_VDF = `\\config\\${STEAM_LIBRARY_VDFNAME}`

const CS_HOME = `${STEAM_LIBRARY_GAME_SAVE_PATH}\\Counter-Strike Global Offensive`
const CS_ID = 730
const CS_EXE_PATH_WINDOWS = `${CS_HOME}\\game\\bin\\win64\\cs2.exe`


const settingStore = useSettingsStore();
const LoginedSteamUserStore = useLoginedSteamUserStore();

const { steamInstallPath, cs2InstallPath, steamInstallPathStr, cs2InstallPathStr } = storeToRefs(LoginedSteamUserStore)

const hasSteam = computed(() => {
    return steamInstallPath.value?.selected !== null
})

const hasCS = computed(() => {
    return cs2InstallPath.value?.selected !== null
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
                    cs2InstallPath.value.selected = csExePath;
                }
                await settingStore.saveChangedViewData();
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
            steamInstallPath.value.selected = null;
        }
        if (cs2InstallPath.value) {
            cs2InstallPath.value.selected = null;
        }
        // await settingStore.saveChangedViewData()
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
        steamInstallPath.value.selected = steamExePath;
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
        cs2InstallPath.value.selected = csExePath;
    }
    await settingStore.saveChangedViewData();
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
    steamInstallPath.value = settingStore.getViewDataItemByKey("steamInstallPath");
    cs2InstallPath.value = settingStore.getViewDataItemByKey("cs2InstallPath");
    await autoCheck();
});

</script>

<style scoped lang="scss">
@use "sass:color";

.container {
    padding: 1em;

    .inner-container {
        height: 100%;
        width: 100%;

        .card {
            overflow: hidden;
            background-color: $success-color-alpha-3;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            border: $simple-border;
            padding: $globe-padding;
            border-radius: $globe-border-radius;

            .title {
                font-size: 1.25rem;
                font-weight: bold;
                margin-bottom: 10px;
            }
        }

        .not-install {
            background-color: $danger-color-alpha-3 !important;
        }
    }

}
</style>