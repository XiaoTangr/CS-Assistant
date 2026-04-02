package cn.javat.csa.cms.controller;

import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Spring Boot 3 统一 404 处理（官方推荐方式）
 * 覆盖：所有不存在的 API / 页面 / 静态资源
 */
@RestController
public class NotFoundController implements ErrorController {

    /**
     * 处理所有 404 请求
     */
    @RequestMapping("/error")
    public Object handleError(HttpServletRequest request, HttpServletResponse response) {
        // 设置404状态码
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);

        // 获取访问路径
        String path = (String) request.getAttribute("jakarta.servlet.error.request_uri");
        if (path == null) path = request.getRequestURI();

        // ==================== 自动区分返回格式 ====================
        String accept = request.getHeader("Accept");

        // 如果是接口请求（JSON格式）
        if (accept != null && (accept.contains(MediaType.APPLICATION_JSON_VALUE) || path.startsWith("/api/"))) {
            return ResponseUtil.withHeaders(
                    null,
                    ResponseBody.<Void>builder()
                            .code(404)
                            .message("请求的资源不存在：" + path)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        }
        // 如果是页面/浏览器访问（返回HTML）
        else {
            response.setContentType("text/html;charset=utf-8");
            return "<html>" +
                    "<head><title>404 未找到</title></head>" +
                    "<body style='text-align:center;margin-top:100px;'>" +
                    "<h1>404 页面不存在</h1>" +
                    "<p>您访问的路径：" + path + " 不存在</p>" +
                    "</body></html>";
        }
    }
}