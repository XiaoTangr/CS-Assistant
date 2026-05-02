package cn.javat.csa.cms.modules.biz.post.vo;

import cn.javat.csa.cms.common.enums.BizPostType;
import cn.javat.csa.cms.modules.sys.user.vo.SysUserVO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 业务文章详情视图对象
 * 用于向前端返回文章详细信息（包含完整内容和作者信息）
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "文章详情视图对象")
public class BizPostDetailVO {

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
     * 文章完整内容（支持HTML/Markdown格式）
     */
    @Schema(description = "完整内容（支持HTML/MD）", example = "<p>文章内容...</p>")
    private String content;

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
     * 作者信息对象
     */
    @Schema(description = "作者信息")
    private SysUserVO author;

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
