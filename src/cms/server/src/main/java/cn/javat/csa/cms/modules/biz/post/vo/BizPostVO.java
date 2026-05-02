package cn.javat.csa.cms.modules.biz.post.vo;

import cn.javat.csa.cms.common.enums.BizPostType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 业务文章视图对象
 * 用于向前端返回文章列表信息
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "文章视图对象")
public class BizPostVO {

    /**
     * 文章ID
     */
    @Schema(description = "文章ID", example = "1")
    private Long id;

    /**
     * 文章标题
     */
    @Schema(description = "标题", example = "我的第一篇文章")
    private String title;

    /**
     * 文章类型
     */
    @Schema(description = "文章类型", example = "TECH")
    private BizPostType type;

    /**
     * 内容摘要（截取前200个字符）
     */
    @Schema(description = "内容摘要（前200字符）", example = "这是一篇关于...")
    private String contentSummary;

    /**
     * 文章状态（-3-违规 -2-驳回 -1-审核中 0-正常）
     */
    @Schema(description = "文章状态 -3-违规 -2-驳回 -1-审核中 0-正常", example = "0")
    private Integer status;

    /**
     * 是否草稿（0-否 1-是）
     */
    @Schema(description = "是否草稿 0-否 1-是", example = "0")
    private Boolean isDraft;

    /**
     * 置顶权重（数值越大越靠前）
     */
    @Schema(description = "置顶权重", example = "0")
    private Integer topOrder;

    /**
     * 作者ID
     */
    @Schema(description = "作者ID", example = "1")
    private Long userId;

    /**
     * 作者昵称
     */
    @Schema(description = "作者昵称", example = "张三")
    private String authorNickname;

    /**
     * 作者头像URL
     */
    @Schema(description = "作者头像", example = "https://example.com/avatar.jpg")
    private String authorAvatar;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间", example = "2024-01-01T12:00:00")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间", example = "2024-01-01T12:00:00")
    private LocalDateTime updateTime;
}
