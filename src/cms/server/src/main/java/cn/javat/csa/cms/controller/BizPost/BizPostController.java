package cn.javat.csa.cms.controller.BizPost;

import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.dto.PaginationParamDTO;
import cn.javat.csa.cms.service.BizPostService;
import cn.javat.csa.cms.util.ResponseUtil;
import cn.javat.csa.cms.vo.Biz.BizPostDetailVO;
import cn.javat.csa.cms.vo.Biz.BizPostVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 业务文章表公共 Controller（公开接口）
 * <p>
 * RESTFUL API 设计：
 * 一、公开接口（无需特殊权限）
 * GET    /api/v1/post              分页查询公开文章列表
 * GET    /api/v1/post/{id}         获取单篇文章详情
 * GET    /api/v1/post/user/{userId} 分页查询指定用户公开文章
 * </p>
 * &#064;RequestAttribute  currentUserId 从 JWT Token 解析的用户 ID（可选）
 * &#064;RequestAttribute  userRole 从 JWT Token 解析的用户角色（可选）
 */
@RestController
@RequestMapping("/api/v1/post")
public class BizPostController {

    private final BizPostService bizPostService;

    @Autowired
    public BizPostController(BizPostService bizPostService) {
        this.bizPostService = bizPostService;
    }

    /**
     * 分页 + 搜索查询公开文章列表（仅返回已发布文章）
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     * 适用角色：anonymous（无需登录）
     *
     * @param paginationParamDTO 分页参数（page, size, keyword, sort, sortOrder）
     * @return 分页结果
     */
    @GetMapping
    public ResponseEntity<ResponseBody<Page<BizPostVO>>> list(
            PaginationParamDTO paginationParamDTO,
            @RequestAttribute(required = false) Long currentUserId,
            @RequestAttribute(required = false) String userRole) {
        // 查询已发布文章 (status=0, isDraft=false)
        ServiceResult<Page<BizPostVO>> result =
                bizPostService.listAllPosts(paginationParamDTO, 0, false);
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 获取单篇文章详情（浏览量 +1）
     * 适用角色：user、creator、admin
     *
     * @param id 文章 ID
     * @return 文章详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResponseBody<BizPostDetailVO>> getById(@PathVariable Long id, @RequestAttribute(required = false) Long currentUserId, @RequestAttribute(required = false) String userRole) {
        ServiceResult<BizPostDetailVO> result = bizPostService.getPostById(id, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            return ResponseUtil.bad(ServiceResCode.RESOURCE_NOT_FOUND.getCode(), ServiceResCode.RESOURCE_NOT_FOUND.getMessage());
        }
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 分页 + 搜索查询指定用户公开文章
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     * 适用角色：anonymous（无需登录）
     *
     * @param userId             用户 ID
     * @param paginationParamDTO 分页参数（page, size, keyword, sort, sortOrder）
     * @return 分页结果
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseBody<Page<BizPostVO>>> listUserPosts(
            @PathVariable Long userId,
            PaginationParamDTO paginationParamDTO,
            @RequestAttribute(required = false) Long currentUserId,
            @RequestAttribute(required = false) String userRole) {
        ServiceResult<Page<BizPostVO>> result = bizPostService.listUserPublicPosts(userId, paginationParamDTO);
        return ResponseUtil.ok(result.getData());
    }
}
