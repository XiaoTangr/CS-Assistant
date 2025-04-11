import { dbConnUtil } from "@/DBA/Utils/DBConnUtil";
import { dbinstallUtil } from "@/DBA/Utils/DBinstallUtil";
import { useMapStore } from "@/store/MapStore";
import { useSettingsStore } from "@/store/SettingsStore";
export default class StartUpUtil {

    static async initDB(): Promise<boolean> {
        if (!await dbConnUtil.init()) {
            throw new Error("Database Connect ini faild!")
        }
        return true;
    }

    static async installDB(): Promise<boolean> {
        return dbinstallUtil.installDB().then(() => true).catch((e) => {
            throw new Error(`Database install faild: ${e}`)
        });
    }

    static async initStores(): Promise<void> {
        const MapStore = useMapStore();
        const SettingsStore = useSettingsStore();
        await SettingsStore.fetchData();
        await MapStore.fetchData();
    }

    static async startUp(): Promise<void> {
        await this.initDB()
        await this.initStores()
        await this.installDB()
    }
}

