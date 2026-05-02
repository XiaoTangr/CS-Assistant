package cn.javat.csa.cms.modules.sys.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户信息更新请求对象
 * 所有字段均为可选，只更新传入的字段
 */
@Data
@Schema(description = "用户信息更新请求对象")
public class SysUserUpdateDTO {

    /**
     * 用户名（登录账号）
     */
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    @Schema(description = "用户名（登录账号）", example = "admin")
    private String username;

    /**
     * 昵称（显示名称）
     */
    @Size(min = 3, max = 20, message = "昵称长度必须在3-20之间")
    @Schema(description = "昵称", example = "管理员")
    private String nickname;

    /**
     * 头像URL地址
     */
    @Schema(description = "头像URL", example = "https://example.com/avatar.jpg")
    private String avatar;

    /**
     * 邮箱地址
     */
    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱", example = "admin@example.com")
    private String email;

    /**
     * Steam好友ID
     */
    @Schema(description = "Steam好友ID", example = "76561198000000000")
    private Long steamId;
}
