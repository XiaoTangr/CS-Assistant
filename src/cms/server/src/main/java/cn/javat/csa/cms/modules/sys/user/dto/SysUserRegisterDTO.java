package cn.javat.csa.cms.modules.sys.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户注册请求对象
 */
@Data
@Schema(description = "用户注册请求对象")
public class SysUserRegisterDTO {

    /**
     * 用户名（登录账号）
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    @Schema(description = "用户名（登录账号）", example = "admin", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    @Schema(description = "密码", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    /**
     * 确认密码（需与密码一致）
     */
    @NotBlank(message = "确认密码不能为空")
    @Schema(description = "确认密码", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    private String confirmPassword;

    /**
     * 昵称（显示名称）
     */
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
