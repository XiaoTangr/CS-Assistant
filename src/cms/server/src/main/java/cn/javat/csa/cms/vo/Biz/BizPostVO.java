package cn.javat.csa.cms.vo.Biz;

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

    @Schema(description = "文章ID", example = "1")
    private Long id;

    @Schema(description = "标题", example = "我的第一篇文章")
    private String title;

    @Schema(description = "文章类型", example = "TECH")
    private BizPostType type;

    @Schema(description = "内容摘要（前200字符）", example = "这是一篇关于...")
    private String contentSummary;

    @Schema(description = "文章状态 -3-违规 -2-驳回 -1-审核中 0-正常", example = "0")
    private Integer status;

    @Schema(description = "是否草稿 0-否 1-是", example = "0")
    private Boolean isDraft;

    @Schema(description = "置顶权重", example = "0")
    private Integer topOrder;

    @Schema(description = "作者ID", example = "1")
    private Long userId;

    @Schema(description = "作者昵称", example = "张三")
    private String authorNickname;

    @Schema(description = "作者头像", example = "https://example.com/avatar.jpg")
    private String authorAvatar;

    @Schema(description = "创建时间", example = "2024-01-01T12:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间", example = "2024-01-01T12:00:00")
    private LocalDateTime updateTime;
}
