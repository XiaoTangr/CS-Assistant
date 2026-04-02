package cn.javat.csaCms.service;

import cn.javat.csaCms.pojo.SysUser;
import java.util.List;

public interface SysUserService {
    /**
     * 根据用户名查询用户
     */
    SysUser getByUsername(String username);

    /**
     * 查询用户权限列表
     */
    List<String> getUserPermissions(Long userId);
}
