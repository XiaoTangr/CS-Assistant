package cn.javat.csaCms.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("biz_post")
public class BizPost {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String title;
    private Integer type;
    private String content;
    private Integer status;
    private Boolean isDelete;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}