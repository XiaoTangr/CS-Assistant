package cn.javat.csa.cms.dto.Biz.BizPost;

import cn.javat.csa.cms.common.enums.BizPostType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 业务文章创建/更新请求对象
 * 用于接收前端提交的创建/更新请求
 */
@Data
@NoArgsConstructor
@SuperBuilder
@Schema(description = "文章创建/更新请求对象")
public class BizPostDTO {

    @NotBlank(message = "标题不能为空")
    @Schema(description = "标题（必填）", example = "我的第一篇文章", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;
    @NotNull(message = "文章类型不能为空")
    @Schema(description = "文章类型", example = "TECH", requiredMode = Schema.RequiredMode.REQUIRED)
    private BizPostType type;
    @NotNull(message = "文章内容不能为空")
    @Schema(description = "内容（支持HTML/MD）（必填）", example = "<p>文章内容...</p>")
    private String content;
    @Schema(description = "文章状态 -3-违规 -2-驳回 -1-审核中 0-正常", example = "-1")
    private Integer status;
    @Schema(description = "是否草稿 0-否 1-是", example = "false")
    private Boolean isDraft;
    @Schema(description = "置顶权重（可选，默认0）", example = "0")
    private Integer topOrder;
}