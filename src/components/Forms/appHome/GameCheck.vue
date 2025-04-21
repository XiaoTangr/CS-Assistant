<template>
    <el-card class="container" v-loading="isloading" body-class="container-body">
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
                    <el-button @click="selectSteamPath" round size="small" plain class="b"
                        type="warning">指定Steam安装位置</el-button>
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
                    未检测到CS2,未安装或者指定Steam安装位置以自动检测
                </div>
            </div>
        </el-card>
    </el-card>
</template>

<script setup lang="ts">

import { SettingsDO } from '@/DBA/DO/SettingsDO';
import { useSettingsStore } from '@/store/SettingsStore';
import VdfUtil from '@/utils/VdfUtil';
import { invoke } from '@tauri-apps/api/core';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';
const SettingsStore = useSettingsStore();

const steamData = ref({

    pathFromdb: "",
    pathCheck: {
        appPath: "",
        cs2Path: ""
    }
})
const isloading = ref(true);
const rowsFromDb = ref<SettingsDO[]>([]);

const pathCheck = async () => {

    let steamInstallPathRow = SettingsStore.getDataByKeyName("steamInstallPath").value as SettingsDO;
    let cs2InstallPathRow = SettingsStore.getDataByKeyName("cs2InstallPath").value as SettingsDO;
    rowsFromDb.value = [steamInstallPathRow, cs2InstallPathRow];



    let steamPath;
    let cs2Path;
    let steamExePath;
    let cs2Exepath;
    steamPath = rowsFromDb.value[0].selected as string;
    cs2Path = rowsFromDb.value[1].selected as string;
    steamExePath = steamPath + "\\steam.exe";
    cs2Exepath = cs2Path + "\\game\\bin\\win64\\cs2.exe";
    isloading.value = false

    if (!steamPath) {
        ElNotification.error("请先指定Steam和CS2安装位置:设置->路径设置->Steam安装位置和CS2安装位置")
        return;
    }

    if (!await invoke("is_file_exists", { filepath: steamExePath })) {
        ElNotification.error(`File not found:${steamExePath}`)
    } else {
        steamData.value.pathCheck.appPath = steamPath;
        if (await invoke("is_file_exists", { filepath: cs2Exepath })) {
            steamData.value.pathCheck.cs2Path = cs2Path;
        } else {
            // 尝试通过vdf获取
            let libraryfoldersPath = steamPath + "\\steamapps\\libraryfolders.vdf";
            let libfVdfObj = await VdfUtil.getVdfObjectbyFilePath(libraryfoldersPath);
            // @ts-ignore
            let libs = libfVdfObj.libraryfolders;
            for (const libraryId in libs) {
                const library = libs[libraryId];
                for (const appId in library.apps) {
                    if (appId === "730") {
                        let path = library.path.replace(/\\\\/g, `\\`) + "\\steamapps\\common\\Counter-Strike Global Offensive"
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
    }
}

const selectSteamPath = async () => {
    const path = await open({
        multiple: false,
        directory: true,
    });
    if (path) {

        let steamExePath = path + "\\steam.exe";

        if (!await invoke("is_file_exists", { filepath: steamExePath })) {
            ElNotification.error(`文件不存在,请重试:${steamExePath}`)
        } else {
            rowsFromDb.value[0].selected = path as string;
            SettingsStore.saveRow(rowsFromDb.value[0]).then(() => {
                ElNotification.success("Steam路径已保存")
                pathCheck();
            })
        }
    }

}


onMounted(async () => {
    pathCheck();
})
</script>

<style scoped lang="scss">
@use "sass:color";

.container {


    .notFound {
        width: 100%;
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
        width: 100%;
        background-color: color.scale($traffic-light-green, $lightness: 40%);
    }
}
</style>
<style lang="scss">
.container-body {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}
</style>