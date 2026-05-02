package cn.javat.csa.cms.modules.biz.post.po;

import cn.javat.csa.cms.common.enums.BizPostType;
import com.baomidou.mybatisplus.annotation.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 业务文章表
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("biz_post")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BizPostPO implements Serializable {

    @Serial
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
    @EnumValue
    private BizPostType type;

    /**
     * 内容（支持 HTML/MD）
     */
    private String content;

    /**
     * 文章状态 -3 违规 -2 驳回 -1 审核中 0 正常
     */
    private Integer status;
    /**
     * 是否草稿 0 False 1 True
     */
    @TableField("is_draft")
    private Boolean isDraft;
    /**
     * 是否删除 0 False 1 True
     */
    @TableLogic(value = "0", delval = "1")
    @TableField("is_delete")
    private Boolean isDelete;

    /**
     * 置顶权重 越大越重
     */
    @TableField("top_order")
    private Integer topOrder;
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
