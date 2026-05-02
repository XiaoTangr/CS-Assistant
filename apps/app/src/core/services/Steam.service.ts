import { BasicSteamLoginUser, KeyValue } from "../models";
import { getVdfObjectByFilePath, readFileAsBase64, searchFilesByName } from "../utils";
import KeyValueService from "./KeyValue.service";
import LogService from "./Log.service";

export default class SteamService {
    private static instance: SteamService;
    private KvService: KeyValueService = KeyValueService.getInstance();
    private constructor() { }
    static getInstance(): SteamService {
        if (!SteamService.instance) {
            SteamService.instance = new SteamService();
        }
        return SteamService.instance;
    }

    private logedSteamUsers: BasicSteamLoginUser[] | null = null;
    private SteamHome: string | null = null;
    private CS2Home: string | null = null;

    private UsersLocalConfigPath: string[] | null = null;

    public async fetchData() {
        this.SteamHome = await this.getSteamHome();
        this.CS2Home = await this.getCS2Home();
        this.UsersLocalConfigPath = await this.getUsersLocalConfigPath();
    }


    /**
     * 获取 Steam 安装路径
     * @returns 返回 Steam 安装路径字符串，若未找到则返回 null
     */
    public async getSteamHome(): Promise<string | null> {
        if (!this.SteamHome) {
            await this.KvService.getValue("steamInstallPath").then((res: KeyValue | null) => {
                this.SteamHome = res?.value as string | null;
            }).catch((error) => {
                LogService.error("[SteamService.getSteamHome] 获取 Steam 安装路径失败:", error);
            });
        }
        return this.SteamHome;
    }

    /**
     * 获取 CS2 安装路径
     * @returns 返回 CS2 安装路径字符串，若未找到则返回 null
     */
    public async getCS2Home(): Promise<string | null> {
        if (!this.CS2Home) {
            await this.KvService.getValue("cs2InstallPath").then((res: KeyValue | null) => {
                this.CS2Home = res?.value as string | null;
            }).catch((error) => {
                LogService.error("[SteamService.getCS2Home] 获取 CS2 安装路径失败:", error);
            });
        }
        return this.CS2Home;
    }
    /**
     * 获取数组：已登录Steam用户的localconfig
     * @returns String[] | null - 返回 localconfig.vdf 路径数组，若未找到则返回 null
     */
    public async getUsersLocalConfigPath(): Promise<any | null> {
        if (!this.UsersLocalConfigPath) {
            if (!this.SteamHome) {
                this.SteamHome = await this.getSteamHome();
            }
            const SEARCH_PATH = `${this.SteamHome}\\userdata`
            // 获取 localconfig.vdf 路径
            await searchFilesByName(SEARCH_PATH, "localconfig.vdf").then((res) => {
                this.UsersLocalConfigPath = res;
                LogService.info("[SteamService.getUsersLocalConfigPath] 获取 用户localconfig.vdf 路径成功:", res);
            }).catch((error) => {
                LogService.error("[SteamService.getUsersLocalConfigPath] 获取 用户localconfig.vdf 路径失败:", error);
            });
        }
        return this.UsersLocalConfigPath;
    }

    /**
     * 获取已登录的 Steam 用户列表
     * @returns 返回已登录的 Steam 用户信息数组，若未找到则返回 null
     */
    public async getLogedSteamUsers(): Promise<BasicSteamLoginUser[] | null> {
        if (!this.logedSteamUsers) {
            const logedUsersVdfPath = `${this.SteamHome}\\config\\loginusers.vdf`;
            this.logedSteamUsers = [];
            if (!this.UsersLocalConfigPath) {
                this.UsersLocalConfigPath = await this.getUsersLocalConfigPath();
            }
            //logedUsers vdf 内容
            const users: Record<string, BasicSteamLoginUser> = (await getVdfObjectByFilePath(logedUsersVdfPath)).users;
            for (const [steamId, user] of Object.entries(users)) {
                let userInfo: BasicSteamLoginUser = {
                    AccountName: user.AccountName ?? "",
                    PersonaName: user.PersonaName ?? "",
                    steamId: steamId,
                    FriendId: 0,
                    avatarBase64: ""
                };
                // 获取 FriendId (通过截取localconfig.vdf路径)
                if (this.UsersLocalConfigPath) {
                    for (const path of this.UsersLocalConfigPath) {
                        let vdf = await getVdfObjectByFilePath(path);
                        const personaName = vdf.UserLocalConfigStore?.friends?.PersonaName;
                        if (personaName !== userInfo.PersonaName) {
                            const regex = /userdata[\\\/](\d+)/i;
                            const match = path.match(regex);
                            if (match) {
                                userInfo.FriendId = parseInt(match[1]);
                            }
                        }
                    }
                }
                // 获取 头像Base64
                const FILE_TYPE = ".png"
                const _avatarsPath = `config\\avatarcache`
                let filePath = `${this.SteamHome}\\${_avatarsPath}\\${userInfo.steamId}${FILE_TYPE}`
                let base64Str = await readFileAsBase64(filePath)
                userInfo.avatarBase64 = `data:image/png;base64,${base64Str}`
                this.logedSteamUsers?.push(userInfo);
            }
        }
        return this.logedSteamUsers;
    }
}
