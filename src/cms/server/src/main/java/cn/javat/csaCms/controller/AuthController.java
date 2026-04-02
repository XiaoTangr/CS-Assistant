package cn.javat.csaCms.controller;

import cn.javat.csaCms.common.ApiResponse;
import cn.javat.csaCms.common.enums.BizCodeEnum;
import cn.javat.csaCms.dto.LoginFormDto;
import cn.javat.csaCms.service.SysUserService;
import cn.javat.csaCms.util.JwtTokenUtil;
import cn.javat.csaCms.util.ResponseUtil;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody @NotNull LoginFormDto loginFormDto) {
        String username = loginFormDto.getUsername();
        String password = loginFormDto.getPassword();

        log.info("用户登录请求：{}", username);

        try {
            // 1. 使用 AuthenticationManager 进行认证（会自动使用 BCrypt 验证密码）
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // 2. 获取认证后的用户信息
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // 3. 生成 JWT Token
            String token = jwtTokenUtil.generateToken(userDetails);

            log.info("用户 {} 登录成功", username);

            // 4. 返回 Token
            Map<String, String> data = new HashMap<>();
            data.put("token", token);

            return ResponseUtil.ok(data, "登录成功");

        } catch (Exception e) {
            log.error("用户 {} 登录失败：{}", username, e.getMessage());
            return ResponseUtil.unauthorized(BizCodeEnum.UNAUTHORIZED);
        }
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        log.info("用户登出");
        // JWT 无状态，客户端只需删除 Token 即可
        // 如需实现 Token 黑名单，可在此处添加逻辑
        return ResponseUtil.ok(null, "登出成功");
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody @NotNull LoginFormDto registerFormDto) {
        // TODO: 实现注册逻辑
        log.info("用户注册请求：{}", registerFormDto.getUsername());
        return ResponseUtil.internalServerError("注册功能暂未实现");
    }
}
