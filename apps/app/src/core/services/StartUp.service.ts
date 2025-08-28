import { useLoginedSteamUserStore } from "@/store/LoginedSteamUserStore";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
import { runMigrations } from "@/core/database";
import LogService from "@/core/services/Log.service";
import { MainRouter } from "@/router/Router";
import { useBackupAndRecoveryStore } from "@/store/BackupAndRecoveryStore";
import { SettingsRepository } from "../repositories";
import { useAppStore } from "@/store/AppStore";
import { needMigration } from "../database/migrations";
export default class StartUpService {

    /**
     *  数据库安装
     * @returns true if install success
     */
    static async installDB() {

        if (await needMigration()) {
            await runMigrations();
        }
    }

    /**
     * 获取数据库数据
     */
    static async fetchDatas(): Promise<void> {
        await useSettingsStore().fetchData();
        await useMapStore().fetchData();
        await useLoginedSteamUserStore().fetchData();
        await useBackupAndRecoveryStore().fetchData();
        await useAppStore().fetchData();
    }


    /**
     * 初始化配置
     */
    static async initConfig(): Promise<void> {
        // 初始化LogService();
        let dblogLevel = await SettingsRepository.findOne({ c_key: "defaultLogLevel" })
        let logLevel = dblogLevel?.selected ?? "0";

        LogService.debug('[StartUp.initConfig(static)]', 'dblogLevel:', logLevel)
        LogService.setLogLevel(parseInt(logLevel as string));
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
        LogService.info('[StartUp.initRoutes(static)]', '开发者模式:', devMode)
    }



    /**
     * 启动程序
     */
    static async startUp(): Promise<void> {
        await this.installDB().then(async () => {
            await this.fetchDatas();
            await this.initConfig();
            await this.initRoutes();
        });
    }
}

