package cn.javat.csaCms.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("sys_role")
public class SysRole {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String roleCode;
    private String roleName;
    private Integer sort;
    private Byte status;
    private String remark;
}