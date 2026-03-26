package cn.javat.csa.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 业务文章表
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("biz_post")
public class BizPost implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户 ID，关联 sys_user.id
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 标题
     */
    private String title;

    /**
     * 类型 int 由代码确定对应关系
     */
    private Integer type;

    /**
     * 内容（支持 HTML/MD）
     */
    private String content;

    /**
     * 文章状态 -2 违规 -1 审核中 0 正常 1 草稿
     */
    private Integer status;

    /**
     * 是否删除 0 False 1 True
     */
    @TableLogic
    @TableField("is_delete")
    private Boolean isDelete;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 最后更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
