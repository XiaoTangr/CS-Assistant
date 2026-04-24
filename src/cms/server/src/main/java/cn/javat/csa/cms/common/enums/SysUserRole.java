package cn.javat.csa.cms.common.enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum SysUserRole {
    USER(0, "普通用户"),
    CREATOR(1, "创作者"),
    ADMIN(2, "管理员");
    private final int code;
    private final String message;
}
