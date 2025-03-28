<template>
    <div class="container">
        <el-card class="notFound" :class="{ 'Found': steamData.pathCheck.appPath !== '' }">
            <div class="v" v-if="steamData.pathCheck.appPath !== ''">
                <div class="pt">
                    Steam已安装!
                </div>
                <el-text class="pb" type="primary" v-html="steamData.pathCheck.appPath" />
            </div>
            <div v-else class="v">
                <div class="pt">
                    未检测到Steam
                </div>
                <div class="pb">
                    <el-button round size="small" plain class="b" type="warning">指定Steam安装位置</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="notFound" :class="{ 'Found': steamData.pathCheck.cs2Path !== '' }">
            <div class="v" v-if="steamData.pathCheck.cs2Path !== ''">
                <div class="pt">
                    CS2已安装!
                </div>
                <el-text class="pb" type="primary" v-html="steamData.pathCheck.cs2Path" />
            </div>
            <div v-else class="v">
                <div class="pt">
                    未检测到CS2
                </div>
                <div class="pb">
                    <el-button round size="small" plain class="b" type="warning">指定Steam位置以自动搜索</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { SettingsDO } from '@/DBA/DO/SettingsDO';
import { useSettingsStore } from '@/store/SettingsStore';
import VdfUtil from '@/utils/VdfUtil';
import { invoke } from '@tauri-apps/api/core';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';

const SettingsStore = useSettingsStore();

const steamData = ref({
    pathFromdb: "",
    pathCheck: {
        appPath: "",
        cs2Path: ""
    }
})

const getPathFromDB = async () => {
    let AppPath = SettingsStore.getDataByKeyName("steamInstallPath").value?.selected;
    if (!AppPath) {
        ElNotification.error("请先指定Steam安装位置:设置->路径设置->Steam安装位置")
        return;
    }
    steamData.value.pathFromdb = AppPath as string;
}

const steamCheck = async () => {
    let steamAppPath = steamData.value.pathFromdb;
    if (steamAppPath == "") {
        return;
    }
    let exePath = steamAppPath + "\\steam.exe";
    if (!await invoke("is_file_exists", { filepath: exePath })) {
        ElNotification.error(`File not found:${exePath}`)
        return;
    }
    steamData.value.pathCheck.appPath = exePath;
};

const cs2Check = async () => {
    let steamAppPath = steamData.value.pathFromdb;
    if (steamAppPath == "") {
        return;
    }
    let libraryfoldersPath = steamAppPath + "\\steamapps\\libraryfolders.vdf";
    if (!await invoke("is_file_exists", { filepath: libraryfoldersPath })) {
        ElNotification.error(`File not found:${libraryfoldersPath}`)
        return;
    }
    let libfVdfObj = await VdfUtil.getVdfObjectbyFilePath(libraryfoldersPath);
    // @ts-ignore
    let libs = libfVdfObj.libraryfolders;
    for (const libraryId in libs) {
        const library = libs[libraryId];
        for (const appId in library.apps) {
            if (appId === "730") {
                let path = library.path.replace(/\\\\/g, `\\`) + "\\steamapps\\common\\Counter-Strike Global Offensive\\game\\bin\\win64\\cs2.exe"
                steamData.value.pathCheck.cs2Path = path;
                let row = SettingsStore.getDataByKeyName("cs2InstallPath").value as SettingsDO;
                row.selected = path;
                SettingsStore.saveRow(row).then(() => {
                    ElNotification.success("CS2路径已自动检测到并保存")
                }).catch((e: any) => {
                    ElNotification.error(`CS2路径已自动检测到,但保存失败:${e}`)
                })
            }
        }
    }
}

onMounted(async () => {
    getPathFromDB();
    steamCheck();
    cs2Check();
})





</script>

<style scoped lang="scss">
@use "sass:color";

.container {

    .notFound {
        margin: calc($globe-margin / 2) 0;
        background-color: color.scale($traffic-light-red, $lightness: 40%);

        .v {

            .pt,
            .pb {
                margin: calc($globe-margin / 4)
            }

            .pb {
                .b {
                    width: 100%;
                }
            }
        }
    }

    .Found {
        background-color: color.scale($traffic-light-green, $lightness: 40%);
    }
}
</style>