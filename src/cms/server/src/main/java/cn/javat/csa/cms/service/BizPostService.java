package cn.javat.csa.cms.service;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.dto.Biz.BizPost.BizPostDTO;
import cn.javat.csa.cms.dto.PaginationParamDTO;
import cn.javat.csa.cms.entity.Biz.BizPost;
import cn.javat.csa.cms.vo.Biz.BizPostDetailVO;
import cn.javat.csa.cms.vo.Biz.BizPostVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 业务文章表 Service 接口
 * <p>
 * 所有涉及如下参数的接口按照如下规范约束
 * page      页码（从 1 开始）
 * size      每页大小（默认 20）
 * keyword   搜索关键词（标题和内容匹配）
 * sort      排序字段（createTime/updateTime/default)
 * 如果是default，则将topOrder(越大越靠前)作为第一排序依据，updateTime(越新越靠前)作为第二排序依据（只影响topOrder为0或者为null的数据），不受sortOrder控制
 * 如果是createTime/updateTime，则只按照传入排序，受sortOrder控制
 * sortOrder 排序顺序（asc/desc，默认 topOrder 越大越靠前。updateTime 越新越靠前）
 * status    文章状态（null=全部，-3=违规，-2=驳回，-1=审核中，0=正常）
 * </p>
 */
public interface BizPostService {

    /**
     * 管理员分页查询全站文章（支持状态筛选）
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     *
     * @param paginationParamDTO 分页参数（包含 page, size, keyword, sort, sortOrder）
     * @param status             文章状态（null=全部，-3=违规，-2=驳回，-1=审核中，0=正常）
     * @param isDraft            是否草稿（null=全部，true=仅草稿，false=非草稿）
     * @return 分页结果
     */
    ServiceResult<Page<BizPostVO>> listAllPosts(PaginationParamDTO paginationParamDTO, Integer status, Boolean isDraft);

    /**
     * 分页查询本人所有文章（支持状态筛选）
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     *
     * @param currentUserId      当前登录用户 ID
     * @param paginationParamDTO 分页参数（包含 page, size, keyword, sort, sortOrder）
     * @param status             文章状态（null=全部，-3=违规，-2=驳回，-1=审核中，0=正常）
     * @param isDraft            是否草稿（null=全部，true=仅草稿，false=非草稿）
     * @return 分页结果
     */
    ServiceResult<Page<BizPostVO>> listMyPosts(Long currentUserId, PaginationParamDTO paginationParamDTO, Integer status, Boolean isDraft);

    /**
     * 分页查询指定用户的公开文章
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     * <p>
     * 仅查询 status=0 的文章
     * </p>
     *
     * @param userId             用户 ID
     * @param paginationParamDTO 分页参数（包含 page, size, keyword, sort, sortOrder）
     * @return 分页结果
     */
    ServiceResult<Page<BizPostVO>> listUserPublicPosts(Long userId, PaginationParamDTO paginationParamDTO);


    /**
     * 获取单篇文章详情（浏览量 +1）
     *
     * @param id            文章 ID
     * @param currentUserId 当前登录用户 ID
     * @return 文章详情
     */
    ServiceResult<BizPostDetailVO> getPostById(Long id, Long currentUserId);

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
     * 管理员修改文章审核/发布状态（可同步设置置顶）
     *
     * @param id            文章 ID
     * @param status        新状态（-3 违规 -2 驳回 -1 审核中 0 正常）
     * @param isDraft       是否草稿
     * @param topOrder      置顶权重 （越大越置顶，0 表示不置顶）
     * @param currentUserId 当前登录用户 ID
     * @return 更新后的文章
     */
    ServiceResult<BizPostDTO> updatePostStatus(Long id, Integer status, boolean isDraft, Integer topOrder, Long currentUserId);

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
