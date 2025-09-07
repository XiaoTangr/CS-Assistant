import { useLoginedSteamUserStore } from "@/store/LoginedSteamUserStore";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
import { baseCRUD, runMigrations } from "@/core/database";
import LogService from "@/core/services/Log.service";
import { MainRouter } from "@/router/Router";
import { useBackupAndRecoveryStore } from "@/store/BackupAndRecoveryStore";
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
        let sqlStr = `select c_selected from t_settings where c_key = 'defaultLogLevel'`;
        let data: any;
        let logLevel: number;
        await baseCRUD.executeRaw(sqlStr).then((res) => {
            data = res.data[0].c_selected as number
        }).catch(() => {
            data = null;
        });
        if (!data) {
            logLevel = 0
            LogService.error(`[StartUp.initConfig(static)] Error to get data from db, set Log Level to: %n `, logLevel)
        } else {
            logLevel = data
            LogService.debug('[StartUp.initConfig(static)] set Log Level to: ', logLevel)
        }
        LogService.setLogLevel(logLevel);
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
        await this.installDB()
        await this.initConfig();
        await this.fetchDatas();
        await this.initRoutes();
    }
}

