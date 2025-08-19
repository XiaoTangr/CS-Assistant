import { useLoginedSteamUserStore } from "@/store/LoginedSteamUserStore";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
import { runMigrations } from "@/core/database";
import LogServices from "@/core/services/Log.services";
import { MainRouter } from "@/router/Router";
import { useBackupAndRecoveryStore } from "@/store/BackupAndRecoveryStore";
import { SettingsRepository } from "../repositories";
import { check } from "@tauri-apps/plugin-updater";
import { ElNotification } from "element-plus";
export default class StartUp {

    /**
     *  数据库安装
     * @returns true if install success
     */
    static async installDB(): Promise<boolean> {
        if (! await runMigrations()) {
            throw new Error("Database install faild!")
        }
        return true
    }

    /**
     * 获取数据库数据
     */
    static async fetchDatas(): Promise<void> {
        await useSettingsStore().fetchData();
        await useMapStore().fetchData();
        await useLoginedSteamUserStore().fetchData();
        await useBackupAndRecoveryStore().fetchData();
    }


    /**
     * 初始化配置
     */
    static async initConfig(): Promise<void> {
        // 初始化LogServices();
        let dblogLevel = await SettingsRepository.findOne({ c_key: "defaultLogLevel" })
        let logLevel = dblogLevel?.selected ?? "0";

        LogServices.debug('[StartUp.initConfig(static)]', 'dblogLevel:', logLevel)
        LogServices.setLogLevel(parseInt(logLevel as string));
    }

    /**
     * 初始化路由
     */
    static async initRoutes() {
        let devMode = useSettingsStore().getViewDataItemByKey("devMode")?.selected;
        if (devMode === false) {
            // 移除开发者页面
            MainRouter.removeRoute("devTools")
        }
        LogServices.info('[StartUp.initRoutes(static)]', '开发者模式:', devMode)
    }

    /**
     * 检查更新
     */
    static async checkUpdate() {
        const update: any = await check();
        LogServices.info('[StartUp.checkUpdate]', '检查更新:', update)
        if (update) {
            ElNotification.success({
                title: "更新提示",
                message: `新版本已发布，请前往下载！${(update.rawJson.platforms['windows-x86_64'])}`,
                duration: 0,
                showClose: true,
                type: "success",

            });
        }
    }

    /**
     * 启动程序
     */
    static async startUp(): Promise<void> {
        await this.initConfig();
        await this.installDB();
        await this.fetchDatas();
        await this.initRoutes();
        await this.checkUpdate();
    }
}

