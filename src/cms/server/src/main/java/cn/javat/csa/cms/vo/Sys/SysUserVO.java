package cn.javat.csa.cms.vo.Sys;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统用户视图对象
 * 用于向前端返回用户信息
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
@Schema(description = "用户信息视图对象")
public class SysUserVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Schema(description = "用户ID", example = "1")
    private Long id;

    @Schema(description = "用户名（登录账号）", example = "admin")
    private String username;

    @Schema(description = "昵称", example = "管理员")
    private String nickname;

    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    private String avatar;

    @Schema(description = "邮箱", example = "admin@example.com")
    private String email;

    @Schema(description = "Steam好友ID", example = "76561198000000000")
    private Long steamId;

    @Schema(description = "用户角色 0-一般用户 1-管理员", example = "1")
    private Integer role;

    @Schema(description = "是否禁用 0-否 1-是", example = "0")
    private Boolean isDisable;

    @Schema(description = "创建时间", example = "2024-01-01T12:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间", example = "2024-01-01T12:00:00")
    private LocalDateTime updateTime;
}
