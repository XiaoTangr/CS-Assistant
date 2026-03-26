package cn.javat.csaCms.service.Impl;

import cn.javat.csaCms.pojo.SysUser;
import cn.javat.csaCms.pojo.CustomUserDetails;
import cn.javat.csaCms.service.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户详情服务实现
 * Spring Security 登录时调用此方法加载用户信息和权限
 */
@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private SysUserService sysUserService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("加载用户信息：{}", username);

        // 1. 查询用户基本信息
        SysUser sysUser = sysUserService.getByUsername(username);
        if (sysUser == null) {
            log.warn("用户不存在：{}", username);
            throw new UsernameNotFoundException("用户名或密码错误");
        }

        // 2. 查询用户权限列表
        List<String> permissions = sysUserService.getUserPermissions(sysUser.getId());

        log.info("用户 {} 的权限列表：{}", username, permissions);

        // 3. 构建 UserDetails
        return new CustomUserDetails(sysUser, permissions);
    }
}
