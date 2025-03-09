import { SettingsDO } from '@/DBA/DO/SettingsDO'
import { defineStore } from 'pinia'
import { ref } from 'vue'


export const usePathSettings = defineStore('pathSettings', () => {
    const rdata = ref<Array<SettingsDO>>(
        [{
            key: 'steamInstallPath',
            text: 'Steam安装路径',
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