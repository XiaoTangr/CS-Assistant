import { get } from './request';
import { SettingsService } from '../services';
import { Notice } from '../models';

/**
 * API管理类 - 集中管理所有API请求
 */
export class ApiService {
    /**
     * 获取公告列表
     * @param username GitHub用户名
     * @param reponame 仓库名
     * @param branchname 分支名
     */
    static async getNotice(
        username: string = "XiaoTangr",
        reponame: string = "CS2H_Data",
        branchname: string = "main"
    ) {
        let baseUrl = (await SettingsService.getSettingByKey("remoteUrlPrefix"))?.selected as string;
        // 构建URL，替换占位符

        if (baseUrl.includes("javat.cn")) {
            baseUrl += "remotedata/"
        } else {
            baseUrl = baseUrl.replace('${username}', username)
                .replace('${reponame}', reponame)
                .replace('${branchname}', branchname);
        }
        return await get<Notice[]>(`${baseUrl}Notice.json`) ?? [];
    }
}

// 默认导出API实例
export default ApiService;

