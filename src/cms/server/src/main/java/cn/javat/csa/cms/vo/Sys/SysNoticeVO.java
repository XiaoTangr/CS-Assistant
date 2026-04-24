package cn.javat.csa.cms.vo.Sys;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "创建/更新公告信息")
public class SysNoticeVO {
    /**
     * 标题
     */
    @Schema(description = "标题")
    private String title;

    /**
     * 内容（支持 HTML/MD）
     */

    @Schema(description = "内容（支持 HTML/MD）")
    private String content;

    /**
     * 是否停用 0-启用 1-停用
     */
    @Schema(description = "是否停用 0-启用 1-停用")
    private Boolean isDisable;

    /**
     * 是否删除 0 FALSE 1 TRUE 默认为 False
     */
    @Schema(description = "是否删除 0 FALSE 1 TRUE")
    private Boolean isDelete;
}
