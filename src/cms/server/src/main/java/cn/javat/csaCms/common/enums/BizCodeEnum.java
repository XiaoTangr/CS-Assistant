package cn.javat.csaCms.common.enums;

import lombok.Getter;

/**
 * 简化版全局业务码枚举
 * 核心规则：
 * 200xx：成功
 * 400xx：客户端错误（参数/权限）
 * 404xx：资源不存在
 * 500xx：服务器错误
 */
public enum BizCodeEnum {
    // ========== 成功类 ==========
    SUCCESS(20000, "操作成功"),
    SUCCESS_EMPTY(20001, "查询成功但无数据"),

    // ========== 客户端错误 ==========
    PARAM_ERROR(40001, "参数错误（为空/格式错误/校验失败）"),
    TOKEN_ERROR(40002, "令牌无效/已过期"),
    UNAUTHORIZED(40003, "未登录"),
    PERMISSION_DENIED(40004, "无操作权限"),

    // ========== 资源不存在 ==========
    RESOURCE_NOT_FOUND(40401, "请求的资源不存在"),

    // ========== 服务器错误 ==========
    SERVER_ERROR(50001, "服务器内部异常");

    /**
     * 业务码
     */
    @Getter
    private final int code;

    /**
     * 默认提示信息
     */
    @Getter
    private final String message;

    /**
     * 构造方法
     *
     * @param code    业务码
     * @param message 提示信息
     */
    BizCodeEnum(int code, String message) {
        this.code = code;
        this.message = message;
    }
}