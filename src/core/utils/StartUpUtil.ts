import { useLoginedSteamUserStore } from "@/store/LoginedSteamUserStore";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
import { connecter } from "../db/connector";
import { runMigrations } from "../db/migrations";
export default class StartUpUtil {

    static async initDB(): Promise<boolean> {
        if (!await connecter.getInstance()) {
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

    static async startUp(): Promise<void> {
        await this.initDB();
        await this.installDB();
        await this.initStores();
    }
}

