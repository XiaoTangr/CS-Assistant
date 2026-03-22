package cn.javat.csaCms.exception;

import cn.javat.csaCms.common.ResponseResult;
import cn.javat.csaCms.common.enums.ResponseStatus;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseResult handleAllExceptions(Exception e, HttpServletRequest request) {
        // 记录详细日志（包括堆栈）
        log.error("系统异常 [{}]: {}", request.getRequestURI(), e.getMessage(), e);

        // 统一返回 500 错误
        return ResponseResult.error(ResponseStatus.INTERNAL_SERVER_ERROR, "服务器内部错误：" + Arrays.toString(e.getStackTrace()));
    }
}
