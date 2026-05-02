package cn.javat.csa.cms.modules.sys.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 用户登录请求对象
 * 用于接收前端提交的登录请求
 */
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@Schema(description = "用户登录请求对象")
public class SysUserLoginDTO {
    /**
     * 用户名（登录账号）
     */
    @NotBlank(message = "username 不能为空")
    @Schema(description = "用户名", example = "admin", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;
    
    /**
     * 密码
     */
    @Schema(description = "密码", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "password 不能为空")
    private String password;
}
