import { useLoginedSteamUserStore, useBackupStore, useAppStore, useAppConfigStore, useKeyValueStore } from "@/store";
import { needMigration, runMigrations } from "@/core/database";
import { MainRouter } from "@/router/Router";
import { LogService } from ".";
import { KeyValueRepository } from "../repositories";
import { KeyValue } from "../models";

export default class StartUpService {

    /**
     *  数据库安装
     * @returns true if install success
     */
    static async installDB() {
        if (await needMigration()) {
            LogService.info("[StartUp.installDB(static)]", "installing database...")
            await runMigrations().then(() => {
                LogService.info("[StartUp.installDB(static)]", "install database success")
            }).catch((err: any) => {
                LogService.error("[StartUp.installDB(static)]", "install database failed:", err);
            });
            return
        }
        LogService.info("[StartUp.installDB(static)]", "database is installed")
    }

    /**
     * 获取数据库数据
     */
    static async fetchDatas(): Promise<void> {
        await useLoginedSteamUserStore().fetchData();
        await useBackupStore().fetchData();
        await useAppStore().fetchData();
        await useAppConfigStore().fetchData();
        await useKeyValueStore().fetchData();
    }


    /**
     * 初始化配置
     */
    static async initConfig(): Promise<void> {
        // 初始化LogService();
        let data: any;
        let logLevel: number;
        await KeyValueRepository.getInstance().findOne({ c_key: "defaultLogLevel" }).then(async (res: KeyValue | null) => {
            data = res ?? null;
        }).catch(() => {
            data = null;
        });
        LogService.debug('[StartUp.initConfig(static)] get log level from db: ', data)
        if (data === null || data === undefined) {
            logLevel = 0
            LogService.error(`[StartUp.initConfig(static)] Error to get data from db, set Log Level to: `, logLevel)
        } else {
            logLevel = data.value as number;
            LogService.debug('[StartUp.initConfig(static)] set Log Level to: ', logLevel)
        }
        LogService.setLogLevel(logLevel);
    }

    /**
     * 初始化路由
     */
    static async initRoutes() {
        let devMode: number = 0;
        await KeyValueRepository.getInstance().findOne({ c_key: "defaultDevMode" }).then(async (res) => {
            devMode = res?.value as number ?? 0;
        }).catch(() => {
            devMode = 0;
        });
        LogService.debug('[StartUp.initRoutes(static)]', '开发者模式:', devMode)
        if (devMode === 0) {
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

