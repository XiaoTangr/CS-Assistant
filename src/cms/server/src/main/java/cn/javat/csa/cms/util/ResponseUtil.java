package cn.javat.csa.cms.util;

import cn.javat.csa.cms.common.ResponseBody;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    /**
     * 自定义头部的响应
     *
     * @param headers 自定义头部
     * @param body    响应体
     * @param code    响应状态码
     * @param <T>     响应体泛型
     * @return 响应实体
     */
    public static <T> ResponseEntity<ResponseBody<T>> withHeaders(
            HttpHeaders headers,
            ResponseBody<T> body,
            HttpStatus code
    ) {
        return new ResponseEntity<>(body, headers, code);
    }

    /**
     * 响应成功
     *
     * @param message 响应消息
     */
    public static <T> ResponseEntity<ResponseBody<T>> ok(String message) {
        return ResponseEntity.ok(ResponseBody.<T>builder()
                .code(200)
                .message(message)
                .data(null)
                .build()
        );
    }

    /**
     * 响应成功
     *
     * @param data 响应数据
     */
    public static <T> ResponseEntity<ResponseBody<T>> ok(T data) {
        return ResponseEntity.ok(ResponseBody.<T>builder()
                .code(200)
                .message("成功")
                .data(data)
                .build()
        );
    }


    /**
     * 响应失败
     *
     * @param code    响应状态码
     * @param message 响应消息
     */
    public static <T> ResponseEntity<ResponseBody<T>> bad(int code, String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseBody.<T>builder()
                        .code(code)
                        .message(message)
                        .data(null)
                        .build()
                );
    }

    /**
     * 服务器内部错误
     *
     * @param message 响应消息
     */
    public static <T> ResponseEntity<ResponseBody<T>> error(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseBody.<T>builder()
                        .code(500)
                        .message(message)
                        .data(null)
                        .build()
                );
    }
    
    /**
     * 自定义状态码的错误响应
     *
     * @param message 响应消息
     * @param status  HTTP 状态码
     */
    public static <T> ResponseEntity<ResponseBody<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(ResponseBody.<T>builder()
                        .code(status.value())
                        .message(message)
                        .data(null)
                        .build()
                );
    }
}
