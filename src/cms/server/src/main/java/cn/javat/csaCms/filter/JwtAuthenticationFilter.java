package cn.javat.csaCms.filter;

import cn.javat.csaCms.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 认证过滤器
 * 每个 API 请求都会经过此过滤器，从 Token 中提取用户信息并设置到 SecurityContext
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. 从请求头中获取 JWT Token
            String token = extractTokenFromRequest(request);

            // 2. 如果 Token 存在且有效，则设置认证信息
            if (StringUtils.hasText(token) && !jwtTokenUtil.isTokenExpired(token)) {
                String username = jwtTokenUtil.extractUsername(token);
                log.debug("JWT Token 解析成功，用户名：{}", username);

                // 3. 从数据库加载用户信息
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 4. 验证 Token 是否匹配用户
                if (jwtTokenUtil.validateToken(token, userDetails)) {
                    // 5. 创建认证对象并设置到 SecurityContext
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.debug("用户 {} 认证成功，已设置 SecurityContext", username);
                }
            }
        } catch (Exception e) {
            log.error("无法设置用户认证：{}", e.getMessage());
        }

        // 6. 继续过滤器链
        filterChain.doFilter(request, response);
    }

    /**
     * 从请求头中提取 Token
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
