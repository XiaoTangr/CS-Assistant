import { dbConnUtil } from "@/DBA/Utils/DBConnUtil";
import { dbinstallUtil } from "@/DBA/Utils/DBinstallUtil";

class StartUpUtil {
    private static instance: StartUpUtil
    private constructor() { }
    public static getInstance(): StartUpUtil {
        if (!StartUpUtil.instance) {
            StartUpUtil.instance = new StartUpUtil();
        }
        return StartUpUtil.instance;
    }

    private async initDB(): Promise<boolean> {
        if (!await dbConnUtil.init()) {
            throw new Error("Database Connect ini faild!")
        }
        return true;
    }

    private async installDB(): Promise<boolean> {
        return dbinstallUtil.installDB().then(() => true).catch((e) => {
            throw new Error(`Database install faild: ${e}`)
        });
    }

    public async startUp(): Promise<void> {
        await this.initDB()
        await this.installDB()
    }
}
export const startUpUtil = StartUpUtil.getInstance();

