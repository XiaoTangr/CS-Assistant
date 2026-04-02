package cn.javat.csa.cms.exception;

import cn.javat.csa.cms.common.ResponseBody;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 全局异常处理器
 * 用于捕获系统中发生的任何异常，向前端返回标准响应
 * 注意：不处理 404 异常，由 NotFoundController 统一处理
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 默认错误消息
     */
    private static final String DEFAULT_ERROR_MESSAGE = "系统繁忙，请稍后再试";

    /**
     * 处理所有未捕获的异常
     *
     * @param e 异常对象
     * @return 统一的错误响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseBody<Void> handleException(Exception e) {

        // 记录错误日志
        log.error("系统发生异常：", e);

        // 返回统一的错误响应
        return ResponseBody.<Void>builder()
                .code(500)
                .message("系统发生异常：" + e)
                .build();
    }

    /**
     * 处理运行时异常（排除 404）
     *
     * @param e 运行时异常
     * @return 统一的错误响应
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseBody<Void> handleRuntimeException(RuntimeException e) {
        // 记录错误日志
        log.error("运行时异常：", e);

        // 返回统一的错误响应
        return ResponseBody.<Void>builder()
                .code(500)
                .message(e.getMessage() != null ? e.getMessage() : DEFAULT_ERROR_MESSAGE)
                .build();
    }

    /**
     * 处理 IllegalArgumentException（参数非法异常）
     *
     * @param e 参数非法异常
     * @return 统一的错误响应
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseBody<Void> handleIllegalArgumentException(IllegalArgumentException e) {
        // 记录警告日志
        log.warn("参数非法：{}", e.getMessage());

        // 返回参数错误响应
        return ResponseBody.<Void>builder()
                .code(400)
                .message(e.getMessage() != null ? e.getMessage() : "参数错误")
                .build();
    }

    /**
     * 处理 NumberFormatException（数字格式异常）
     * 当路径变量无法转换为预期的数字类型时触发
     *
     * @param e 数字格式异常
     * @return 统一的错误响应
     */
    @ExceptionHandler(NumberFormatException.class)
    public ResponseBody<Void> handleNumberFormatException(NumberFormatException e) {
        // 记录警告日志
        log.warn("数字格式错误：{}", e.getMessage());

        // 返回参数错误响应
        return ResponseBody.<Void>builder()
                .code(400)
                .message("ID 格式错误，应为有效的数字")
                .build();
    }

    /**
     * 处理 MethodArgumentTypeMismatchException（方法参数类型不匹配异常）
     * 当请求参数或路径变量类型与方法参数不匹配时触发
     *
     * @param e 方法参数类型不匹配异常
     * @return 统一的错误响应
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseBody<Void> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        // 记录警告日志
        log.warn("参数类型不匹配：参数名={}, 期望类型={}, 实际值={}", 
                e.getName(), e.getRequiredType().getSimpleName(), e.getValue());

        // 返回参数错误响应
        String paramName = e.getName() != null ? e.getName() : "未知参数";
        return ResponseBody.<Void>builder()
                .code(400)
                .message(String.format("参数 '%s' 类型错误，应为 %s 类型", 
                        paramName, e.getRequiredType() != null ? e.getRequiredType().getSimpleName() : "Long"))
                .build();
    }
}
