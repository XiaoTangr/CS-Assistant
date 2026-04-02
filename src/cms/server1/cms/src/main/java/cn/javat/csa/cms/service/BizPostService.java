package cn.javat.csa.cms.service;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.dto.BizPostDTO;
import cn.javat.csa.cms.dto.BizPostDetailDTO;
import cn.javat.csa.cms.entity.BizPost;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 业务文章表 Service 接口
 */
public interface BizPostService {

    /**
     * 分页查询公开文章列表（仅返回已发布文章 status=0）
     *
     * @param page    页码
     * @param size    每页大小
     * @param keyword 搜索关键词（标题模糊搜索）
     * @param sort    排序字段（createTime/viewCount/likeCount）
     * @return 分页结果
     */
    ServiceResult<Page<BizPostDTO>> listPublicPosts(int page, int size, String keyword, String sort);

    /**
     * 获取单篇文章详情（浏览量 +1）
     *
     * @param id            文章 ID
     * @param currentUserId 当前登录用户 ID
     * @return 文章详情
     */
    ServiceResult<BizPostDetailDTO> getPostById(Long id, Long currentUserId);

    /**
     * 分页查询指定用户的公开文章
     *
     * @param userId  用户 ID
     * @param page    页码
     * @param size    每页大小
     * @param keyword 搜索关键词
     * @param sort    排序字段
     * @return 分页结果
     */
    ServiceResult<Page<BizPostDTO>> listUserPublicPosts(Long userId, int page, int size, String keyword, String sort);

    /**
     * 创建新文章
     *
     * @param post          文章信息
     * @param currentUserId 当前登录用户 ID
     * @return 创建的文章
     */
    ServiceResult<BizPostDTO> createPost(BizPost post, Long currentUserId);

    /**
     * 修改自己的文章
     *
     * @param id            文章 ID
     * @param post          更新的文章信息
     * @param currentUserId 当前登录用户 ID
     * @return 更新后的文章
     */
    ServiceResult<BizPostDTO> updateMyPost(Long id, BizPost post, Long currentUserId);

    /**
     * 删除自己的文章
     *
     * @param id            文章 ID
     * @param currentUserId 当前登录用户 ID
     */
    ServiceResult<Void> deleteMyPost(Long id, Long currentUserId);

    /**
     * 分页查询本人所有文章（包含草稿/未审核/已发布）
     *
     * @param currentUserId 当前登录用户 ID
     * @param page          页码
     * @param size          每页大小
     * @param keyword       搜索关键词
     * @param sort          排序字段
     * @return 分页结果
     */
    ServiceResult<Page<BizPostDTO>> listMyPosts(Long currentUserId, int page, int size, String keyword, String sort);

    /**
     * 管理员分页查询全站文章（支持状态筛选）
     *
     * @param page    页码
     * @param size    每页大小
     * @param keyword 搜索关键词
     * @param sort    排序字段
     * @param status  状态筛选（all/published/audit/reject）
     * @return 分页结果
     */
    ServiceResult<Page<BizPostDTO>> listAllPosts(int page, int size, String keyword, String sort, String status);

    /**
     * 管理员修改文章审核/发布状态（可同步设置置顶）
     *
     * @param id            文章 ID
     * @param status        新状态（-2 违规 -1 审核中 0 正常 1 草稿）
     * @param topOrder      置顶权重 （0 否 ）
     * @param currentUserId 当前登录用户 ID
     * @return 更新后的文章
     */
    ServiceResult<BizPostDTO> updatePostStatus(Long id, Integer status, Integer topOrder, Long currentUserId);

    /**
     * 管理员编辑任意文章
     *
     * @param id            文章 ID
     * @param post          更新的文章信息
     * @param currentUserId 当前登录用户 ID
     * @return 更新后的文章
     */
    ServiceResult<BizPostDTO> adminUpdatePost(Long id, BizPost post, Long currentUserId);

    /**
     * 管理员强制删除任意文章
     *
     * @param id            文章 ID
     * @param currentUserId 当前登录用户 ID
     */
    ServiceResult<Void> adminDeletePost(Long id, Long currentUserId);
}
