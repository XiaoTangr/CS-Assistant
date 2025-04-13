import { dbConnecter } from "@/DBA/DA/DBConnecter";
import { DBInstaller } from "@/DBA/DA/DBInstaller";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
export default class StartUpUtil {

    static async initDB(): Promise<boolean> {
        if (!await dbConnecter.init()) {
            throw new Error("Database Connect ini faild!")
        }
        return true;
    }

    static async installDB(): Promise<boolean> {
        if (! await DBInstaller.installDB()) {
            throw new Error("Database install faild!")
        }
        return true
    }

    static async initStores(): Promise<void> {
        const MapStore = useMapStore();
        const SettingsStore = useSettingsStore();
        await SettingsStore.fetchData();
        await MapStore.fetchData();
    }

    static async startUp(): Promise<void> {
        await this.initDB();
        await this.installDB();
        await this.initStores();
    }
}

