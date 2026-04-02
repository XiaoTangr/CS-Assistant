package cn.javat.csa.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统用户表
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("sys_user")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户 ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户名（登录账号）
     */
    private String username;

    /**
     * BCrypt 加密密码（数据库查询和 JSON 序列化时都忽略）
     */
    @JsonIgnore
    @TableField("password")
    private String password;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像 URL
     */
    private String avatar;

    /**
     * 邮箱
     */
    private String email;

    /**
     * Steam 好友 ID
     */
    @TableField("steam_id")
    private Long steamId;

    /**
     * 用户角色 0 一般用户 1 管理员
     */
    private Integer role;

    /**
     * 是否禁用 0 FALSE 1 TRUE
     */
    @TableField("is_disable")
    private boolean isDisable;

    /**
     * 是否删除 0 FALSE  1 TRUE
     */
    @TableField("is_delete")
    private boolean isDelete;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
