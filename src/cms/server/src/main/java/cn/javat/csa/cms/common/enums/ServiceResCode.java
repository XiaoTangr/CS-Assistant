package cn.javat.csa.cms.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 服务层响应码枚举，与 HTTP 状态码类似
 */
@Getter
@AllArgsConstructor
public enum ServiceResCode {
    /**
     * 操作成功
     */
    SUCCESS(200, "操作成功"),
    /**
     * 参数错误
     */
    PARAM_ERROR(400, "参数错误"),
    /**
     * 操作资源已经存在
     */
    RESOURCE_ALREADY_EXISTS(409, "资源已存在"),
    /**
     * 请求资源不存在
     */
    RESOURCE_NOT_FOUND(404, "资源不存在"),
    /**
     * 没有权限
     */
    NO_PERMISSION(403, "没有权限"),
    /**
     * 服务器错误
     */
    SERVER_ERROR(500, "服务器错误"),
    /**
     * 未知错误
     */
    UNKNOWN_ERROR(999, "未知错误"),
    ;
    
    final int code;

    final String message;

}
