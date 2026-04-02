package cn.javat.csa.cms.controller.Admin;

import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.dto.BizPostDTO;
import cn.javat.csa.cms.dto.BizPostDetailDTO;
import cn.javat.csa.cms.entity.BizPost;
import cn.javat.csa.cms.service.BizPostService;
import cn.javat.csa.cms.util.ResponseUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 业务文章表管理 Controller（管理员专属）
 * <p>
 * RESTFUL API 设计：
 * GET    /api/v1/admin/post              分页 + 搜索 + 状态筛选全站文章
 * PUT    /api/v1/admin/post/{id}/status  修改文章状态
 * PUT    /api/v1/admin/post/{id}         编辑任意文章
 * DELETE /api/v1/admin/post/{id}         强制删除任意文章
 * </p>
 * &#064;RequestAttribute  currentUserId 从 JWT 解析当前用户 ID
 * &#064;RequestAttribute  userRole 从 JWT 解析的用户角色（必须为 admin）
 */
@RestController
@RequestMapping("/api/v1/admin/post")
public class AdminBizPostController {

    private final BizPostService bizPostService;

    public AdminBizPostController(BizPostService bizPostService) {
        this.bizPostService = bizPostService;
    }

    /**
     * 分页 + 搜索 + 状态筛选全站文章
     * 适用角色：admin
     *
     * @param page    页码（默认 1）
     * @param size    条数（默认 10）
     * @param keyword 搜索词
     * @param sort    排序：createTime/viewCount/likeCount
     * @param status  状态筛选：all/published/audit/reject
     * @return 分页结果
     */
    @GetMapping
    public ResponseEntity<ResponseBody<Page<BizPostDTO>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String status,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        // 验证是否为管理员（role: 2=管理员）
        if (parseRole(userRole) != 2) {
            return ResponseUtil.bad(
                    ServiceResCode.NO_PERMISSION.getCode(),
                    ServiceResCode.NO_PERMISSION.getMessage()
            );
        }

        ServiceResult<Page<BizPostDTO>> result = bizPostService.listAllPosts(page, size, keyword, sort, status);
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 修改文章审核/发布状态（可同步设置置顶权重）
     * 适用角色：admin
     *
     * @param id       文章 ID
     * @param status   新状态（-2 违规 -1 审核中 0 正常 1 草稿）
     * @param topOrder 置顶权重（越大越置顶，0 表示不置顶）
     * @return 更新后的文章
     */
    @PutMapping("/{id:\\d+}/status")
    public ResponseEntity<ResponseBody<BizPostDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer topOrder,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        // 验证是否为管理员（role: 2=管理员）
        if (parseRole(userRole) != 2) {
            return ResponseUtil.bad(
                    ServiceResCode.NO_PERMISSION.getCode(),
                    ServiceResCode.NO_PERMISSION.getMessage()
            );
        }

        ServiceResult<BizPostDTO> result = bizPostService.updatePostStatus(id, status, topOrder, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 设置文章置顶权重（可选操作）
     * 适用角色：admin
     *
     * @param id       文章 ID
     * @param topOrder 置顶权重（越大越置顶，0 表示不置顶）
     * @return 更新后的文章
     * @deprecated 请使用 /status 接口，通过 topOrder 参数控制置顶
     */
    @Deprecated
    @PutMapping("/{id:\\d+}/top")
    public ResponseEntity<ResponseBody<BizPostDTO>> updateTopOrder(
            @PathVariable Long id,
            @RequestParam(required = false) Integer topOrder,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        // 兼容旧接口，调用新的 status 接口
        return updateStatus(id, null, topOrder, currentUserId, userRole);
    }

    /**
     * 编辑任意文章
     * 适用角色：admin
     *
     * @param id  文章 ID
     * @param dto 更新的文章信息
     * @return 更新后的文章
     */
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<ResponseBody<BizPostDTO>> update(
            @PathVariable Long id,
            @RequestBody BizPostDTO dto,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        // 验证是否为管理员（role: 2=管理员）
        if (parseRole(userRole) != 2) {
            return ResponseUtil.bad(
                    ServiceResCode.NO_PERMISSION.getCode(),
                    ServiceResCode.NO_PERMISSION.getMessage()
            );
        }

        BizPost post = new BizPost();
        BeanUtils.copyProperties(dto, post);
        ServiceResult<BizPostDTO> result = bizPostService.adminUpdatePost(id, post, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 强制删除任意文章
     * 适用角色：admin
     *
     * @param id 文章 ID
     * @return 删除结果
     */
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<ResponseBody<Void>> delete(
            @PathVariable Long id,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        // 验证是否为管理员（role: 2=管理员）
        if (parseRole(userRole) != 2) {
            return ResponseUtil.bad(
                    ServiceResCode.NO_PERMISSION.getCode(),
                    ServiceResCode.NO_PERMISSION.getMessage()
            );
        }

        ServiceResult<Void> result = bizPostService.adminDeletePost(id, currentUserId);
        if (!result.isSuccess()) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok("删除成功");
    }

    /**
     * 解析用户角色（兼容数字和字符串格式）
     * role: 0=普通用户，1=创作者，2=管理员
     *
     * @param userRole 角色值（可能是数字或字符串）
     * @return 角色数字代码
     */
    private int parseRole(String userRole) {
        if (userRole == null || userRole.isEmpty()) {
            return 0; // 默认为普通用户
        }
        try {
            return Integer.parseInt(userRole);
        } catch (NumberFormatException e) {
            // 如果是字符串格式，尝试映射
            return switch (userRole.toLowerCase()) {
                case "admin" -> 2;
                case "creator" -> 1;
                default -> 0;
            };
        }
    }
}
