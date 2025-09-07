import { get } from './request';
import { SettingsService } from '../services';
import { Notice } from '../models';
import { check } from '@tauri-apps/plugin-updater';

/**
 * API管理类 - 集中管理所有API请求
 */
export class ApiService {


    static GITHUB_USERNAME = "XiaoTangr";
    static GITHUB_REPONAME = "CS-Assistant";


    /**
     * 获取公告列表
     * @param username GitHub用户名
     * @param reponame 仓库名
     * @param branchname 分支名
     */
    static async getNotice(
        username: string = this.GITHUB_USERNAME,
        reponame: string = this.GITHUB_REPONAME,
        branchname: string = "gh-pages"
    ) {

        let baseUrl = (await SettingsService.getSettingByKey("remoteUrlPrefix"))?.selected as string;
        // 构建URL，替换占位符

        if (!baseUrl.includes("javat.cn")) {
            baseUrl = baseUrl.replace('${username}', username)
                .replace('${reponame}', reponame)
                .replace('${branchname}', branchname);
        }
        baseUrl += '/remotedata'
        return (await get<Notice[]>(`${baseUrl}/Notice.json`)) ?? null;
    }


    static async getUpdateCheck() {
        return await check();
    }
}

// 默认导出API实例
export default ApiService;

