package cn.javat.csa.cms.controller.BizPost;

import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.dto.Biz.BizPost.BizPostDTO;
import cn.javat.csa.cms.dto.PaginationParamDTO;
import cn.javat.csa.cms.entity.Biz.BizPost;
import cn.javat.csa.cms.service.BizPostService;
import cn.javat.csa.cms.util.ResponseUtil;
import cn.javat.csa.cms.vo.Biz.BizPostVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
public class BizPostAdminController {

    private final BizPostService bizPostService;

    @Autowired
    public BizPostAdminController(BizPostService bizPostService) {
        this.bizPostService = bizPostService;
    }

    /**
     * 分页 + 搜索 + 状态筛选全站文章
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     * 适用角色：admin
     *
     * @param paginationParamDTO 分页参数（page, size, keyword, sort, sortOrder）
     * @param status             文章状态（null=全部，-3=违规，-2=驳回，-1=审核中，0=正常）
     * @param isDraft            是否草稿（null=全部，true=仅草稿，false=非草稿）
     * @return 分页结果
     */
    @GetMapping
    public ResponseEntity<ResponseBody<Page<BizPostVO>>> list(
            PaginationParamDTO paginationParamDTO,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Boolean isDraft,
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

        ServiceResult<Page<BizPostVO>> result = bizPostService.listAllPosts(paginationParamDTO, status, isDraft);
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 修改文章审核/发布状态（可同步设置置顶权重）
     * 适用角色：admin
     *
     * @param id     文章 ID
     * @param params 状态参数 {status, isDraft, topOrder}
     * @return 更新后的文章
     */
    @PutMapping("/{id:\\d+}/status")
    public ResponseEntity<ResponseBody<BizPostDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> params,
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

        // 从 Map 中提取参数
        Integer status = params.get("status") != null ?
                ((Number) params.get("status")).intValue() : null;
        boolean isDraft = params.get("isDraft") != null ?
                (Boolean) params.get("isDraft") : false;
        Integer topOrder = params.get("topOrder") != null ?
                ((Number) params.get("topOrder")).intValue() : null;

        ServiceResult<BizPostDTO> result = bizPostService.updatePostStatus(id, status, isDraft, topOrder, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
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
