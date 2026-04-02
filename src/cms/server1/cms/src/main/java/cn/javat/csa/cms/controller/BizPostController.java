package cn.javat.csa.cms.controller;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.List;

/**
 * 业务文章表公共 Controller
 * <p>
 * RESTFUL API 设计：
 * GET    /api/post              分页查询公开文章列表
 * GET    /api/post/{id}         获取单篇文章详情
 * GET    /api/post/user/{userId} 分页查询指定用户公开文章
 * POST   /api/post              创建新文章（创作者）
 * PUT    /api/post/{id}         修改自己的文章
 * DELETE /api/post/{id}         删除自己的文章
 * GET    /api/post/me           分页查询本人所有文章
 * </p>
 * &#064;RequestAttribute  currentUserId 从 JWT Token 解析的用户 ID
 * &#064;RequestAttribute  userRole 从 JWT Token 解析的用户角色
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
     * 适用角色：user、creator、admin
     *
     * @param page    页码（默认 1）
     * @param size    条数（默认 10）
     * @param keyword 搜索词
     * @param sort    排序：createTime/viewCount/likeCount
     * @return 分页结果
     */
    @GetMapping
    public ResponseEntity<ResponseBody<Page<BizPostDTO>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestAttribute(required = false) Long currentUserId,
            @RequestAttribute(required = false) String userRole
    ) {
        ServiceResult<Page<BizPostDTO>> result = bizPostService.listPublicPosts(page, size, keyword, sort);
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
    public ResponseEntity<ResponseBody<BizPostDetailDTO>> getById(
            @PathVariable Long id,
            @RequestAttribute(required = false) Long currentUserId,
            @RequestAttribute(required = false) String userRole
    ) {
        ServiceResult<BizPostDetailDTO> result = bizPostService.getPostById(id, currentUserId);
        if (!result.isSuccess() || result.getData() == null) {
            return ResponseUtil.bad(
                    ServiceResCode.RESOURCE_NOT_FOUND.getCode(),
                    ServiceResCode.RESOURCE_NOT_FOUND.getMessage()
            );
        }
        return ResponseUtil.ok(result.getData());
    }

    /**
     * 分页 + 搜索查询指定用户公开文章
     * 适用角色：user、creator、admin
     *
     * @param userId  用户 ID
     * @param page    页码（默认 1）
     * @param size    条数（默认 10）
     * @param keyword 搜索词
     * @param sort    排序：createTime/viewCount/likeCount
     * @return 分页结果
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseBody<Page<BizPostDTO>>> listUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestAttribute(required = false) Long currentUserId,
            @RequestAttribute(required = false) String userRole
    ) {
        ServiceResult<Page<BizPostDTO>> result = bizPostService.listUserPublicPosts(userId, page, size, keyword, sort);
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

        BizPost post = new BizPost();
        BeanUtils.copyProperties(dto, post);
        ServiceResult<BizPostDTO> result = bizPostService.createPost(post, currentUserId);
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
            @PathVariable Long id,
            @RequestBody BizPostDTO dto,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        BizPost post = new BizPost();
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
     * 分页 + 搜索查询本人所有文章（包含草稿/未审核/已发布）
     * 适用角色：creator、admin
     *
     * @param page    页码（默认 1）
     * @param size    条数（默认 10）
     * @param keyword 搜索词
     * @param sort    排序：createTime/viewCount/likeCount
     * @return 分页结果
     */
    @GetMapping("/me")
    public ResponseEntity<ResponseBody<Page<BizPostDTO>>> listMyPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestAttribute Long currentUserId,
            @RequestAttribute String userRole
    ) {
        ServiceResult<Page<BizPostDTO>> result = bizPostService.listMyPosts(currentUserId, page, size, keyword, sort);
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
