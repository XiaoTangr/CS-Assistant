package cn.javat.csa.cms.interceptor;


import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.util.JwtUtil;
import cn.javat.csa.cms.util.ResponseUtil;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.lang.NonNullApi;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证拦截器
 * 负责 JWT Token 验证和用户信息注入
 */
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationInterceptor.class);

    // 放行的路径及方法（不需要 JWT 验证）
    public static final Map<String, String> ALLOW_PATH;

    static {
        ALLOW_PATH = Map.of(
                "/api/v1/auth/login", "POST",
                "/api/v1/auth/register", "POST",
                "/api/v1/auth/reset", "POST",
                "/api/v1/post", "GET",
                "/api/v1/post/\\d+", "GET"  // 使用正则表达式匹配 /api/v1/post/{id}
        );
    }

    @Override
    public boolean preHandle(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // 1. 检查是否为放行的公开接口
        if (isAllowPath(path, method)) {
            logger.debug("Allow path without authentication: {} {}", method, path);
            return true;
        }

        // 2. 从请求头获取 JWT Token
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            logger.warn("Missing Authorization header: {} {}", method, path);
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");

            ResponseBody<Object> responseBody = ResponseBody.builder()
                    .code(401)
                    .message("请提供有效的认证令牌")
                    .build();
            response.getWriter().write(responseBody.toString());
            return false;
        }

        // 3. 去除 Bearer 前缀
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 4. 验证 JWT Token
        DecodedJWT decodedJWT = JwtUtil.verifyToken(token);
        if (decodedJWT == null) {
            logger.warn("Invalid or expired token: {} {}", method, path);
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"message\":\"无效的认证令牌或已过期\",\"success\":false}");
            return false;
        }

        // 5. 从 Token 中提取用户信息
        String userId = decodedJWT.getClaim("userId").asString();
        String username = decodedJWT.getClaim("username").asString();
        String userRole = decodedJWT.getClaim("role").asString();

        // 6. 将用户信息注入到请求属性中，供 Controller 使用
        request.setAttribute("currentUserId", Long.parseLong(userId));
        request.setAttribute("currentUser", username);
        request.setAttribute("userRole", userRole != null ? userRole : "user");

        logger.debug("Authentication passed: userId={}, username={}, role={}", userId, username, userRole);

        return true;
    }

    /**
     * 检查路径和方法是否在放行列表中
     *
     * @param path   请求路径
     * @param method 请求方法
     * @return true-放行，false-需要验证
     */
    private boolean isAllowPath(String path, String method) {
        for (Map.Entry<String, String> entry : ALLOW_PATH.entrySet()) {
            String allowPath = entry.getKey();
            String allowMethod = entry.getValue();
            
            // 检查方法是否匹配
            if (!method.equals(allowMethod)) {
                continue;
            }
            
            // 如果配置的路径包含正则元字符，则使用正则匹配
            if (allowPath.contains("\\d") || allowPath.contains(".*") || allowPath.contains(".+")) {
                if (path.matches(allowPath)) {
                    return true;
                }
            } else {
                // 否则进行精确匹配
                if (path.equals(allowPath)) {
                    return true;
                }
            }
        }
        
        return false;
    }
}
