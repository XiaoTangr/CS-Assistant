package cn.javat.csa.cms.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统通知公告表
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("sys_notice")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SysNotice implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 公告 ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容（支持 HTML/MD）
     */
    private String content;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 是否删除 0 FALSE 1 TRUE
     */
    @TableLogic(value = "0", delval = "1")
    @TableField("is_delete")
    private Boolean isDelete;
}
