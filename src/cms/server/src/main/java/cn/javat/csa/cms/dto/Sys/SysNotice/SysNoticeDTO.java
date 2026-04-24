package cn.javat.csa.cms.dto.Sys.SysNotice;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "创建/更新公告信息")
public class SysNoticeDTO {
    /**
     * 标题
     */
    @NotBlank(message = "标题不能为空")
    @Schema(description = "标题")
    private String title;

    /**
     * 内容（支持 HTML/MD）
     */
    @NotBlank(message = "内容不能为空")
    @Schema(description = "内容（支持 HTML/MD）")
    private String content;

    /**
     * 是否停用 0-启用 1-停用（可选，更新时传参）
     */
    @Schema(description = "是否停用 0-启用 1-停用")
    private Boolean isDisable;

    /**
     * 是否删除 0 FALSE 1 TRUE 默认为 False
     */
    @Schema(description = "是否删除 0 FALSE 1 TRUE")
    private Boolean isDelete;
}
