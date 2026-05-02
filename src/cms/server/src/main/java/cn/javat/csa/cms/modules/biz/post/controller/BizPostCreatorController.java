package cn.javat.csa.cms.modules.biz.post.controller;

import cn.javat.csa.cms.common.base.ResponseBody;
import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.modules.biz.post.dto.BizPostDTO;
import cn.javat.csa.cms.common.base.dto.PageQueryDTO;
import cn.javat.csa.cms.modules.biz.post.po.BizPostPO;
import cn.javat.csa.cms.modules.biz.post.service.BizPostService;
import cn.javat.csa.cms.common.util.ResponseUtil;
import cn.javat.csa.cms.modules.biz.post.vo.BizPostDetailVO;
import cn.javat.csa.cms.modules.biz.post.vo.BizPostVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 业务文章表创作者 Controller（登录用户/本人操作）
 * <p>
 * RESTFUL API 设计：
 * POST   /api/v1/post/me           创建新文章
 * GET    /api/v1/post/me           分页查询本人所有文章
 * PUT    /api/v1/post/me/{id}      修改自己的文章
 * DELETE /api/v1/post/me/{id}      删除自己的文章
 * </p>
 * &#064;RequestAttribute  currentUserId 从 JWT Token 解析的用户 ID
 * &#064;RequestAttribute  userRole 从 JWT Token 解析的用户角色
 */
@RestController
@RequestMapping("/api/v1/post/me")
public class BizPostCreatorController {

    private final BizPostService bizPostService;

    @Autowired
    public BizPostCreatorController(BizPostService bizPostService) {
        this.bizPostService = bizPostService;
    }

    /**
     * 获取单篇文章详情
     *
     * @param id 文章 ID
     * @return 文章详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResponseBody<BizPostDetailVO>> getMyPostById(
            @PathVariable Long id,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        ServiceResult<BizPostDetailVO> result = bizPostService.getPostById(id, currentUserId);
        if (!result.isSuccess()) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
    }


    /**
     * 创建新文章
     * 适用角色：creator、admin
     *
     * @param dto 文章信息
     * @return 创建的文章
     */
    @PostMapping
    public ResponseEntity<ResponseBody<BizPostDTO>> create(
            @RequestBody BizPostDTO dto,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        // 检查 dto 的必要内容是否填写，收集所有缺失字段
        List<String> missingFields = new java.util.ArrayList<>();

        if (dto.getTitle() == null || dto.getTitle().isEmpty()) {
            missingFields.add("title");
        }
        if (dto.getContent() == null || dto.getContent().isEmpty()) {
            missingFields.add("content");
        }
        if (dto.getType() == null) {
            missingFields.add("type");
        }

        // 如果有缺失字段，一次性返回所有缺失字段列表
        if (!missingFields.isEmpty()) {
            return ResponseUtil.bad(
                    ServiceResCode.PARAM_ERROR.getCode(),
                    "缺少必要参数：" + String.join(", ", missingFields)
            );
        }

        // 验证角色是否为创作者或管理员（role: 0=普通用户，1=创作者，2=管理员）
        int role = parseRole(userRole);
        if (role != 1 && role != 2) {
            return ResponseUtil.bad(
                    ServiceResCode.NO_PERMISSION.getCode(),
                    ServiceResCode.NO_PERMISSION.getMessage()
            );
        }

        BizPostPO post = new BizPostPO();
        BeanUtils.copyProperties(dto, post);
        ServiceResult<BizPostDTO> result = bizPostService.createPost(post, currentUserId);
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 分页 + 搜索查询本人所有文章（包含草稿/未审核/已发布）
     * <p>
     * 排序规则：
     * - sort=default: topOrder 降序为第一排序，updateTime 降序为第二排序（不受 sortOrder 控制）
     * - sort=createTime/updateTime: 按指定字段排序，受 sortOrder 控制
     * </p>
     * 适用角色：creator、admin
     *
     * @param pageQueryDTO 分页参数（page, size, keyword, sort, sortOrder）
     * @param status             文章状态（null=全部，-3=违规，-2=驳回，-1=审核中，0=正常）
     * @param isDraft            是否草稿（null=全部，true=仅草稿，false=非草稿）
     * @return 分页结果
     */
    @GetMapping
    public ResponseEntity<ResponseBody<Page<BizPostVO>>> listMyPosts(
            PageQueryDTO pageQueryDTO,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Boolean isDraft,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        ServiceResult<Page<BizPostVO>> result = bizPostService.listMyPosts(currentUserId, pageQueryDTO, status, isDraft);
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 修改自己的文章
     * 适用角色：creator、admin
     *
     * @param id  文章 ID
     * @param dto 更新的文章信息
     * @return 更新后的文章
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResponseBody<BizPostDTO>> update(
            @NotBlank(message = "文章ID不能为空") @PathVariable Long id,
            @NotBlank(message = "文章信息不能为空") @RequestBody BizPostDTO dto,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        BizPostPO post = new BizPostPO();
        BeanUtils.copyProperties(dto, post);
        post.setId(id);

        ServiceResult<BizPostDTO> result = bizPostService.updateMyPost(id, post, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            if (result.getCode() == ServiceResCode.NO_PERMISSION.getCode()) {
                return ResponseUtil.bad(
                        ServiceResCode.NO_PERMISSION.getCode(),
                        ServiceResCode.NO_PERMISSION.getMessage()
                );
            }
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 删除自己的文章
     * 适用角色：creator、admin
     *
     * @param id 文章 ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseBody<Void>> delete(
            @PathVariable Long id,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        ServiceResult<Void> result = bizPostService.deleteMyPost(id, currentUserId);
        if (!result.isSuccess()) {
            if (result.getCode() == ServiceResCode.NO_PERMISSION.getCode()) {
                return ResponseUtil.bad(
                        ServiceResCode.NO_PERMISSION.getCode(),
                        ServiceResCode.NO_PERMISSION.getMessage()
                );
            }
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok("删除成功");
    }

    /**
     * 修改文章审核/发布状态（可同步设置置顶权重）
     * 适用角色：admin
     *
     * @param id     文章 ID
     * @param params 状态参数 { isDraft, topOrder}
     * @return 更新后的文章
     */
    @PutMapping("/{id:\\d+}/status")
    public ResponseEntity<ResponseBody<BizPostDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> params,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {

        boolean isDraft = params.get("isDraft") != null ?
                (Boolean) params.get("isDraft") : false;
        Integer topOrder = params.get("topOrder") != null ?
                ((Number) params.get("topOrder")).intValue() : null;

        ServiceResult<BizPostDTO> result = bizPostService.updatePostStatus(id, null, isDraft, topOrder, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
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
