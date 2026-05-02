package cn.javat.csa.cms.modules.sys.notice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * 系统公告视图对象
 * 用于向前端返回公告信息
 */
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "公告信息")
public class SysNoticeVO {

    /**
     * 公告ID
     */
    @Schema(description = "公告ID", example = "1")
    private Long id;

    /**
     * 公告标题
     */
    @Schema(description = "标题", example = "公告标题")
    private String title;

    /**
     * 公告内容（支持HTML/Markdown格式）
     */
    @Schema(description = "内容（支持 HTML/MD）", example = "公告内容...")
    private String content;

    /**
     * 是否停用（0-启用 1-停用）
     */
    @Schema(description = "是否停用 0-启用 1-停用", example = "false")
    private Boolean isDisable;

    /**
     * 是否删除（0-否 1-是）
     */
    @Schema(description = "是否删除 0-否 1-是", example = "false")
    private Boolean isDelete;

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
