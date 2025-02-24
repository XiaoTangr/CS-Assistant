import Database from "@tauri-apps/plugin-sql";

export class DBConn {
    public db!: Promise<Database>;

    init = async () => {
        this.db = Database.load("sqlite:cs2h.db");
        return this.db;
    }
    close = async () => {
        const db = await this.db;
        await db.close();
    }
}