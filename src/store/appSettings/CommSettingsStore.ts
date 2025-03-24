import { SettingsDO } from "@/DBA/DO/SettingsDO";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommSettings = defineStore("CommonSettings", () => {

    const rdata = ref<Array<SettingsDO>>(
        [{
            key: 'steamInstallPath',
            text: 'Steam安装路径111111111',
            description: '选择Steam安装位置',
            type: "PathInput",
            selected: "null",
            options: [],
            chapter: "appSettings",
            section: "CommSettings"
        }, {
            key: 'steamLibraryWithCS',
            text: 'Steam库(包含CS2)',
            description: '选择包含CS2的Steam库',
            type: "PathInput",
            selected: "null",
            options: [],
            chapter: "appSettings",
            section: "CommSettings"
        }]
    )

    return { rdata }
})