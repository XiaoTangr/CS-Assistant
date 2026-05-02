package cn.javat.csa.cms.modules.sys.notice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 系统公告创建/更新请求对象
 * 用于接收前端提交的创建/更新公告请求
 */
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "创建/更新公告信息")
public class SysNoticeDTO {

    /**
     * 公告标题
     */
    @NotBlank(message = "标题不能为空")
    @Schema(description = "标题", example = "公告标题")
    private String title;

    /**
     * 公告内容（支持HTML/Markdown格式）
     */
    @NotBlank(message = "内容不能为空")
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
}
