package cn.javat.csaCms.util;


import cn.javat.csaCms.common.ApiResponse;
import cn.javat.csaCms.common.enums.BizCodeEnum;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * 响应工具类（对接业务码枚举）
 */
public class ResponseUtil<T> {

    /**
     * 构建成功响应
     *
     * @param httpStatus HTTP状态码
     * @param msg        提示信息
     * @param code       业务码
     * @param data       数据
     * @param <T>        数据类型
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> response(HttpStatus httpStatus, String msg, int code, T data) {
        return ResponseEntity.status(httpStatus).body(
                ApiResponse.<T>builder()
                        .code(code)
                        .message(msg)
                        .data(data)
                        .build()
        );
    }


    /**
     * 构建成功响应
     *
     * @param msg  提示信息
     * @param code 业务码
     * @param data 数据
     * @param <T>  数据类型
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(String msg, int code, T data) {
        return ResponseEntity.ok(
                ApiResponse.<T>builder()
                        .code(code)
                        .message(msg)
                        .data(data)
                        .build()
        );
    }


    /**
     * 构建成功响应 默认提示信息
     *
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok() {
        return ResponseEntity.ok(
                ApiResponse.<T>builder()
                        .code(BizCodeEnum.SUCCESS.getCode())
                        .message(BizCodeEnum.SUCCESS.getMessage())
                        .build()
        );
    }

    /**
     * 构建成功响应 默认提示信息
     *
     * @param data 数据
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(
                ApiResponse.<T>builder()
                        .code(BizCodeEnum.SUCCESS.getCode())
                        .message(BizCodeEnum.SUCCESS.getMessage())
                        .data(data)
                        .build()
        );
    }

    /**
     * 构建成功响应 自定义提示信息和 数据
     *
     * @param data 数据
     * @param msg  提示信息
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, String msg) {
        return ResponseEntity.ok(
                ApiResponse.<T>builder()
                        .code(BizCodeEnum.SUCCESS.getCode())
                        .message(msg)
                        .data(data)
                        .build()
        );
    }


    /**
     * 构建鉴权失败响应
     *
     * @param bizCodeEnum 业务码枚举
     * @param <T>         数据类型
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> unauthorized(BizCodeEnum bizCodeEnum) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<T>builder()
                        .code(bizCodeEnum.getCode())
                        .message(bizCodeEnum.getMessage())
                        .build()
        );
    }

    /**
     * 构建鉴权失败响应
     *
     * @param <T> 数据类型
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<T>builder()
                        .code(BizCodeEnum.UNAUTHORIZED.getCode())
                        .message(BizCodeEnum.UNAUTHORIZED.getMessage())
                        .build());
    }


    /**
     * 构建服务器异常响应
     *
     * @param <T> 数据类型
     * @return 响应
     */
    public static <T> ResponseEntity<ApiResponse<T>> internalServerError() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<T>builder()
                        .code(BizCodeEnum.SERVER_ERROR.getCode())
                        .message(BizCodeEnum.SERVER_ERROR.getMessage())
                        .build()
        );
    }

    /**
     * 构建服务器异常响应
     *
     * @param msg 提示信息
     *
     */
    public static <T> ResponseEntity<ApiResponse<T>> internalServerError(String msg) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.<T>builder()
                        .code(BizCodeEnum.SERVER_ERROR.getCode())
                        .message(msg)
                        .build()
        );
    }
}