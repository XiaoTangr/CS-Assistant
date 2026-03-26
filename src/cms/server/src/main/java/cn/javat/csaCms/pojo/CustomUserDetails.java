package cn.javat.csaCms.pojo;

import cn.javat.csaCms.pojo.SysUser;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 自定义用户详情类
 * 将 SysUser 转换为 Spring Security 需要的 UserDetails
 */
@Data
public class CustomUserDetails implements UserDetails {

    private final SysUser sysUser;
    private final List<String> authorities;

    public CustomUserDetails(SysUser sysUser, List<String> authorities) {
        this.sysUser = sysUser;
        this.authorities = authorities;
    }

    /**
     * 获取用户权限集合
     * 用于 @PreAuthorize("hasAuthority('xxx')") 等注解
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return sysUser.getPassword();
    }

    @Override
    public String getUsername() {
        return sysUser.getUsername();
    }

    /**
     * 账户是否未过期
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 账户是否未锁定
     */
    @Override
    public boolean isAccountNonLocked() {
        return sysUser.getStatus() == 0;
    }

    /**
     * 凭证是否未过期
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 账户是否可用
     */
    @Override
    public boolean isEnabled() {
        return sysUser.getStatus() == 0 && !sysUser.getIsDelete();
    }

    /**
     * 获取原始用户对象
     */
    public SysUser getSysUser() {
        return sysUser;
    }
}
