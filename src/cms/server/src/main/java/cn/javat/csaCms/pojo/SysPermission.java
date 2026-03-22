package cn.javat.csaCms.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("sys_permission")
public class SysPermission {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String permCode;
    private String permName;
    private Integer parentId;
    private Byte permType;
    private Byte resourceType;
    private Integer sort;
    private Byte status;
    private String icon;
    private String path;
}