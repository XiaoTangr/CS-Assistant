package cn.javat.csa.cms.common.aspect;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 日志切面
 * 用于记录 Controller 层方法的请求和响应信息
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * 定义切点：拦截所有 Controller 层的方法
     */
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerPointcut() {
    }

    /**
     * 环绕通知：记录请求和响应信息
     */
    @Around("controllerPointcut()")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();

        // 记录请求信息
        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString() == null ? "" : request.getQueryString();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        logger.info("========== 请求开始 ==========");
        logger.info("请求方法：{}", method);
        logger.info("请求 URI: {}", uri);
        logger.info("查询参数：{}", queryString.isEmpty() ? "无" : queryString);
        logger.info("客户端 IP: {}", getClientIp(request));
        logger.info("目标类：{}", className);
        logger.info("目标方法：{}", methodName);

        // 执行目标方法
        Object result;
        try {
            result = joinPoint.proceed();
            
            // 记录响应信息
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            logger.info("响应状态：成功");
            logger.info("处理耗时：{} ms", duration);
            logger.info("========== 请求结束 ==========\n");
            
            return result;
        } catch (Throwable throwable) {
            // 记录异常信息
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            logger.error("响应状态：异常");
            logger.error("处理耗时：{} ms", duration);
            logger.error("异常信息：{}", throwable.getMessage());
            logger.error("========== 请求结束 ==========\n", throwable);
            
            throw throwable;
        }
    }

    /**
     * 获取客户端真实 IP 地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 如果是多个代理的 IP，取第一个
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
