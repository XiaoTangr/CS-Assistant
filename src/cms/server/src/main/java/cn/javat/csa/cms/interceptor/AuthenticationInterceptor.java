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
        Map<String, String> allowPath = new HashMap<>();
        
        // Swagger 文档
        allowPath.put("/swagger-ui/**", "*");
        allowPath.put("/v3/api-docs", "*");
        allowPath.put("/v3/api-docs/*", "*");
        
        // 认证接口
        allowPath.put("/api/v1/auth/login", "POST");
        allowPath.put("/api/v1/auth/register", "POST");
        allowPath.put("/api/v1/auth/reset", "POST");
        
        // 公开查询接口
        allowPath.put("/api/v1/post", "GET");
        allowPath.put("/api/v1/post/\\d+", "GET");
        allowPath.put("/api/v1/notice", "GET");
        allowPath.put("/api/v1/notice/\\d+", "GET");
        allowPath.put("/api/v1/user", "GET");
        
        // CORS 预检请求
        allowPath.put("/**", "OPTIONS");
        
        ALLOW_PATH = Map.copyOf(allowPath);
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

            // 检查方法是否匹配（支持通配符 "*"）
            if (!"*".equals(allowMethod) && !method.equals(allowMethod)) {
                continue;
            }

            // 如果配置的路径包含正则元字符或通配符，则使用模式匹配
            if (isPatternPath(allowPath)) {
                // 将通配符转换为正则表达式
                String regexPattern = convertWildcardToRegex(allowPath);
                logger.debug("Checking path: {} against pattern: {} (regex: {})", path, allowPath, regexPattern);
                if (path.matches(regexPattern)) {
                    logger.debug("Path matched: {} -> {}", path, allowPath);
                    return true;
                }
            } else {
                // 否则进行精确匹配
                if (path.equals(allowPath)) {
                    logger.debug("Path exactly matched: {}", path);
                    return true;
                }
            }
        }

        logger.debug("No matching allow path found for: {} {}", method, path);
        return false;
    }

    /**
     * 判断路径是否为模式路径（包含通配符或正则表达式）
     *
     * @param path 配置的路径
     * @return true-是模式路径，false-是精确路径
     */
    private boolean isPatternPath(String path) {
        return path.contains("*") ||
                path.contains("?") ||
                path.contains("\\d") ||
                path.contains("\\w") ||
                path.contains(".") ||
                path.contains("[") ||
                path.contains("(") ||
                path.contains("+") ||
                path.contains("{");
    }

    /**
     * 将通配符路径转换为正则表达式
     * 支持：
     * - * 匹配任意字符序列（不包括 /）
     * - ** 匹配任意字符序列（包括 /）
     * - ? 匹配单个字符
     * - \d+ 匹配一个或多个数字
     *
     * @param wildcardPath 通配符路径
     * @return 转换后的正则表达式
     */
    private String convertWildcardToRegex(String wildcardPath) {
        StringBuilder regex = new StringBuilder();
        int i = 0;
        int len = wildcardPath.length();

        while (i < len) {
            char c = wildcardPath.charAt(i);

            if (c == '\\' && i + 1 < len) {
                // 处理转义字符
                char nextChar = wildcardPath.charAt(i + 1);
                if (nextChar == 'd') {
                    // \d 匹配数字
                    regex.append("\\d");
                    i += 2;
                    // 检查是否有 +
                    if (i < len && wildcardPath.charAt(i) == '+') {
                        regex.append("+");
                        i++;
                    } else if (i < len && wildcardPath.charAt(i) == '*') {
                        regex.append("*");
                        i++;
                    }
                } else if (nextChar == 'w') {
                    // \w 匹配单词字符
                    regex.append("\\w");
                    i += 2;
                } else {
                    // 其他转义字符
                    regex.append('\\').append(nextChar);
                    i += 2;
                }
            } else if (c == '*') {
                // 检查是否是 **
                if (i + 1 < len && wildcardPath.charAt(i + 1) == '*') {
                    // ** 匹配任意字符（包括 /）
                    regex.append(".*");
                    i += 2;
                    // 跳过后续的 /
                    if (i < len && wildcardPath.charAt(i) == '/') {
                        i++;
                    }
                } else {
                    // * 匹配任意字符（不包括 /）
                    regex.append("[^/]*");
                    i++;
                }
            } else if (c == '?') {
                // ? 匹配单个字符（不包括 /）
                regex.append("[^/]");
                i++;
            } else if (c == '.') {
                // 转义 .
                regex.append("\\.");
                i++;
            } else if (c == '(' || c == ')' || c == '[' || c == ']' ||
                    c == '{' || c == '}' || c == '+' || c == '^' ||
                    c == '$' || c == '|') {
                // 转义其他正则特殊字符
                regex.append('\\').append(c);
                i++;
            } else {
                regex.append(c);
                i++;
            }
        }

        return regex.toString();
    }
}
