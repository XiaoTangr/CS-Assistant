package cn.javat.csa.cms.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class SysUserRegisterDTO {
    /**
     * 用户名（登录账号）
     */
    private String username;

    /**
     * BCrypt 加密密码（数据库查询和 JSON 序列化时都忽略）
     */
    @TableField("password")
    private String password;
    private String confirmPassword;
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
}
