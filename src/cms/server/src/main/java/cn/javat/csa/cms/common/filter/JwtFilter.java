package cn.javat.csa.cms.common.filter;

import cn.javat.csa.cms.common.properties.FilterProperties;
import cn.javat.csa.cms.common.util.PathUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 认证过滤器
 * 处理需要认证的接口,验证 JWT Token
 */
@Component
public class JwtFilter extends OncePerRequestFilter {
    //    日志
    private final Logger logger;
    private final FilterProperties filterProp;


    public JwtFilter(FilterProperties filterProp) {
        this.filterProp = filterProp;
        this.logger = LoggerFactory.getLogger(JwtFilter.class);
        logger.info("AuthFilter 初始化完成");
        logger.info("allowPublic: {}", filterProp.getAllowPublic());
        logger.info("allow: {}", filterProp.getAllow());
        logger.info("allowWithMethod: {}", filterProp.getAllowWithMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws IOException, ServletException {
        String uri = request.getRequestURI();
        String method = request.getMethod();


        logger.info("AuthFilter 检查: {} {}", method, uri);


        // ====================== 开关：关闭认证直接放行 ======================
        if (!filterProp.isEnableAuth()) {
            logger.warn("认证已关闭，直接放行：{} {}", request.getMethod(), request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }
        // ====================================================================

        // 0. 优先检查公共路径放行(最高优先级)
        if (filterProp.getAllowPublic() != null) {
            for (String pattern : filterProp.getAllowPublic()) {
                if (PathUtil.match(pattern, uri)) {
                    logger.info("公共路径放行: {}", uri);
                    filterChain.doFilter(request, response);
                    return;
                }
            }
        }

        // 1. 无条件放行
        for (String pattern : filterProp.getAllow()) {
            if (PathUtil.match(pattern, uri)) {
                logger.info("无条件放行: {}", uri);
                filterChain.doFilter(request, response);
                return;
            }
        }


        // 2. 路径+方法 放行
        boolean allowed = false;
        String matchedPattern = null;
        if (filterProp.getAllowWithMethod() != null) {
            for (var entry : filterProp.getAllowWithMethod().entrySet()) {
                String pattern = entry.getKey();
                String allowMethod = entry.getValue();

                if (PathUtil.match(pattern, uri) && allowMethod.equalsIgnoreCase(method)) {
                    allowed = true;
                    matchedPattern = pattern;
                    break;
                }
            }
        }

        if (allowed) {
            logger.info("路径+方法放行: {} {} (匹配: {})", method, uri, matchedPattern);
            filterChain.doFilter(request, response);
            return;
        }

        // 3. 其余全部拦截
        logger.warn("未授权访问: {} {}", method, uri);
        response.setStatus(401);
        response.getWriter().write("Unauthorized");
    }
}