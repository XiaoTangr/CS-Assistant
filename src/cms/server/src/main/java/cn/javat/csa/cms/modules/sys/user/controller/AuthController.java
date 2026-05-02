package cn.javat.csa.cms.modules.sys.user.controller;


import cn.javat.csa.cms.common.base.ResponseBody;
import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.modules.sys.user.dto.SysUserLoginDTO;
import cn.javat.csa.cms.modules.sys.user.dto.SysUserRegisterDTO;

import cn.javat.csa.cms.modules.sys.user.service.SysUserService;
import cn.javat.csa.cms.common.util.JwtUtil;
import cn.javat.csa.cms.common.util.ResponseUtil;
import cn.javat.csa.cms.modules.sys.user.vo.SysUserVO;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final SysUserService sysUserService;

    public AuthController(SysUserService sysUserService) {
        this.sysUserService = sysUserService;
    }


    @PostMapping("/login")
    public ResponseEntity<ResponseBody<SysUserVO>> login(
            @Valid @NonNull @RequestBody SysUserLoginDTO params
    ) {
        String username = params.getUsername();
        String password = params.getPassword();

        ServiceResult<SysUserVO> login = sysUserService.login(username, password);
        int loginCode = login.getCode();
        if (loginCode == ServiceResCode.SUCCESS.getCode()) {
            // 生成 JWT Token（包含角色信息）
            String token = JwtUtil.generateToken(login.getData());
            // 创建响应头并添加 Token
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            ResponseBody<SysUserVO> responseBody = ResponseBody.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(login.getData())
                    .build();

            return ResponseUtil.withHeaders(
                    headers,
                    responseBody,
                    HttpStatus.OK
            );
        } else if (loginCode == ServiceResCode.PARAM_ERROR.getCode()) {
            return ResponseUtil.bad(
                    4002,
                    "用户名或密码错误"
            );
        } else if (loginCode == ServiceResCode.RESOURCE_NOT_FOUND.getCode()) {
            return ResponseUtil.bad(
                    4003,
                    "用户不存在"
            );
        } else {
            return ResponseUtil.error(
                    "登录失败"
            );
        }

    }


    /**
     * 注册
     *
     * @param dto 注册信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public ResponseEntity<ResponseBody<SysUserVO>> register(
            @Valid @NonNull @RequestBody SysUserRegisterDTO dto
    ) {
//        检查字段返回缺失字段列表
        List<String> missingFields = new java.util.ArrayList<>();
        if (dto.getUsername() == null || dto.getUsername().isEmpty()) {
            missingFields.add("username");
        }
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            missingFields.add("password");
        }
        if (dto.getConfirmPassword() == null || dto.getConfirmPassword().isEmpty()) {
            missingFields.add("confirmPassword");
        }
        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
            missingFields.add("email");
        }

        // 如果有缺失字段，一次性返回所有缺失字段列表
        if (!missingFields.isEmpty()) {
            return ResponseUtil.bad(
                    ServiceResCode.PARAM_ERROR.getCode(),
                    "缺少必要参数：" + String.join(", ", missingFields)
            );
        }

        ServiceResult<SysUserVO> register = sysUserService.register(dto);
        int registerCode = register.getCode();

        if (registerCode == ServiceResCode.SUCCESS.getCode()) {
//            如果注册成功，则返回用户信息，设置 Token
            String token = JwtUtil.generateToken(register.getData());
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            ResponseBody<SysUserVO> responseBody = ResponseBody.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(register.getData())
                    .build();
            return ResponseUtil.withHeaders(
                    headers,
                    responseBody,
                    HttpStatus.OK
            );
        } else if (registerCode == ServiceResCode.RESOURCE_ALREADY_EXISTS.getCode()) {
            return ResponseUtil.bad(4004, "用户已存在");
        } else if (registerCode == ServiceResCode.PARAM_ERROR.getCode()) {
            return ResponseUtil.bad(4006, "两次输入的密码不一致");
        } else {
            return ResponseUtil.error(register.getMessage() != null ? register.getMessage() : "注册失败");
        }
    }

    /**
     * 从 Token 中获取用户信息
     */
    @GetMapping("/current")
    public ResponseEntity<ResponseBody<SysUserVO>> current(@RequestAttribute Long currentUserId) {
        ServiceResult<SysUserVO> result = sysUserService.getById(currentUserId);

        if (result.isSuccess()) {
            return ResponseUtil.ok(result.getData());
        } else if (result.getCode() == ServiceResCode.RESOURCE_NOT_FOUND.getCode()) {
            return ResponseUtil.bad(
                    4005,
                    "用户不存在"
            );
        } else {
            return ResponseUtil.error(
                    "获取用户信息失败"
            );
        }
    }


    @PostMapping("/reset")
    public ResponseEntity<ResponseBody<SysUserVO>> reset(
            @NonNull @RequestBody Map<String, String> params
    ) {
        String username = params.get("username");
        String email = params.get("email");
        String password = params.get("password");
        String confirmPassword = params.get("confirmPassword");
        List<String> missingFields = new java.util.ArrayList<>();
        if (username == null || username.isEmpty()) {
            missingFields.add("username");
        }
        if (email == null || email.isEmpty()) {
            missingFields.add("email");
        }
        if (password == null || password.isEmpty()) {
            missingFields.add("password");
        }
        if (confirmPassword == null || confirmPassword.isEmpty()) {
            missingFields.add("confirmPassword");
        }
        if (!missingFields.isEmpty()) {
            return ResponseUtil.bad(
                    ServiceResCode.PARAM_ERROR.getCode(),
                    "缺少必要参数：" + String.join(", ", missingFields)
            );
        }
        ServiceResult<SysUserVO> reset = sysUserService.reset(username, email, password, confirmPassword);
        int resetCode = reset.getCode();
        if (resetCode == ServiceResCode.SUCCESS.getCode()) {
            return ResponseUtil.ok(reset.getData());
        } else if (resetCode == ServiceResCode.RESOURCE_NOT_FOUND.getCode()) {
            return ResponseUtil.bad(
                    4005,
                    "用户不存在"
            );
        } else if (resetCode == ServiceResCode.PARAM_ERROR.getCode()) {
            return ResponseUtil.bad(
                    4006,
                    "两次输入的密码不一致"
            );
        } else {
            return ResponseUtil.error(
                    "重置密码失败"
            );
        }
    }
}
