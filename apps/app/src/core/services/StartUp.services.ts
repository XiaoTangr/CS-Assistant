import { useLoginedSteamUserStore } from "@/store/LoginedSteamUserStore";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
import { connecter } from "../database/connector";
import { baseCRUD, runMigrations } from "@/core/database";
import LogServices from "@/core/services/Log.services";
import { MainRouter } from "@/router/Router";
import { ref } from "vue";
import { t_Settings } from "../database/models";
import { fromDb } from "../utils";
export default class StartUp {

    static async initDB(): Promise<boolean> {
        if (!connecter.getInstance()) {
            throw new Error("Database Connect ini faild!")
        }
        return true;
    }


    static async installDB(): Promise<boolean> {
        if (! await runMigrations()) {
            throw new Error("Database install faild!")
        }
        return true
    }

    static async initStores(): Promise<void> {
        await useSettingsStore().fetchData();
        await useMapStore().fetchData();
        await useLoginedSteamUserStore().fetchData();
    }


    // 根据配置初始化程序
    static async initConfig(): Promise<void> {

        let dblogLevel = (await baseCRUD.queryWhere<t_Settings>(
            "t_settings",
            { c_key: "defaultLogLevel" }
        ));

        let logLevel = fromDb(dblogLevel[0]).selected;

        LogServices.setLogLevel(parseInt(logLevel as string));
    }


    static async initRoutes() {

        let devMode = ref(useSettingsStore().getViewDataItemByKey("devMode"));

        if (devMode.value?.selected === false) {
            LogServices.error("开发者模式已关闭")
            MainRouter.removeRoute("devTools")
        }
    }

    static async startUp(): Promise<void> {
        await this.initConfig();
        await this.initDB();
        await this.installDB();
        await this.initStores();
        await this.initRoutes();
    }
}

