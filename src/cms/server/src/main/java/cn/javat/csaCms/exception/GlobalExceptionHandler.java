package cn.javat.csaCms.exception;

import cn.javat.csaCms.common.ApiResponse;
import cn.javat.csaCms.util.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

/**
 * 全局异常处理器 - 所有异常统一返回标准响应
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理所有异常，统一返回标准响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception e) {
        log.error("[全局异常处理] 捕获异常：{}", e.getMessage(), e);
        return ResponseUtil.internalServerError(e.getMessage());
    }
}
