<template>
    <div class="container" v-loading="isloading">
        <el-card style=" display:flex;flex-direction:column;flex: 1;" :body-style="{ flex: 1 }">
            <template #default>
                <div class="default">
                    <el-card class="item notFound" :class="{ 'Found': steamData.pathCheck.appPath !== '' }">
                        <div class="inner-item">
                            {{ steamData.pathCheck.appPath !== '' ? "Steam已安装! " : "未检测到Steam" }}
                        </div>
                        <CopyText :text="steamData.pathCheck.appPath" v-if="steamData.pathCheck.appPath !== ''">
                            <el-text class="inner-item " type="primary" v-html="steamData.pathCheck.appPath" />
                        </CopyText>
                        <el-button style="justify-content: center;" class="inner-item " v-else @click="selectSteamPath"
                            round plain type="warning">指定Steam安装位置</el-button>
                    </el-card>
                    <el-card class="item notFound" :class="{ 'Found': steamData.pathCheck.cs2Path !== '' }">
                        <div class="inner-item">
                            {{ steamData.pathCheck.cs2Path !== '' ? "CS2已安装! " : "未检测到CS2,未安装或者指定Steam安装位置以自动检测" }}
                        </div>
                        <CopyText :text="steamData.pathCheck.cs2Path" v-if="steamData.pathCheck.cs2Path !== ''">
                            <el-text class="inner-item" type="primary" v-html="steamData.pathCheck.cs2Path" />
                        </CopyText>

                    </el-card>
                </div>
            </template>
        </el-card>
    </div>

</template>

<script setup lang="ts">


import { useSettingsStore } from '@/store/SettingsStore';
import { getVdfObjectByFilePath } from '@/core/utils/VdfUtil';
import { invoke } from '@tauri-apps/api/core';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';
import CopyText from '@/components/Public/CopyText.vue';
import { Settings } from '@/models/Settings.model';
const SettingsStore = useSettingsStore();

const steamData = ref({

    pathFromdb: "",
    pathCheck: {
        appPath: "",
        cs2Path: ""
    }
})
const isloading = ref(true);
const rowsFromDb = ref<Settings[]>([]);

const pathCheck = async () => {

    let steamInstallPathRow = SettingsStore.getDataByKeyName("steamInstallPath").value as Settings;
    let cs2InstallPathRow = SettingsStore.getDataByKeyName("cs2InstallPath").value as Settings;
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
            let libfVdfObj = await getVdfObjectByFilePath(libraryfoldersPath);
            // @ts-ignore
            let libs = libfVdfObj.libraryfolders;
            for (const libraryId in libs) {
                const library = libs[libraryId];
                for (const appId in library.apps) {
                    if (appId === "730") {
                        let path = library.path.replace(/\\\\/g, `\\`) + "\\steamapps\\common\\Counter-Strike Global Offensive"
                        steamData.value.pathCheck.cs2Path = path;
                        let row = SettingsStore.getDataByKeyName("cs2InstallPath").value as Settings;
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
    display: flex;
    flex-direction: column;

    .default {
        width: 100%;
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;


        .item {
            margin-bottom: calc($globe-margin / 2);


            .inner-item {
                margin-bottom: calc($globe-margin / 2);
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
            }

            .inner-item:last-child {
                margin-bottom: 0;
            }
        }

        .item:last-child {
            margin-bottom: 0;
        }

        .notFound {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            background-color: color.scale($traffic-light-red, $lightness: 40%);
        }

        .Found {
            width: 100%;
            background-color: color.scale($traffic-light-green, $lightness: 40%);
        }
    }
}
</style>
