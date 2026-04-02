package cn.javat.csa.cms.service;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.dto.SysUserDTO;
import cn.javat.csa.cms.dto.SysUserRegisterDTO;
import cn.javat.csa.cms.entity.SysUser;

import java.util.Map;

public interface SysUserService {
    /**
     * 登录
     *
     * @param username 用户名
     * @param password 密码
     * @return 登录结果
     */
    ServiceResult<SysUserDTO> login(String username, String password);

    /**
     * 注册
     *
     * @param dto 注册信息
     * @return 注册结果
     */
    ServiceResult<SysUserDTO> register(SysUserRegisterDTO dto);

    ServiceResult<SysUserDTO> getById(Long currentUserId);

    /**
     * 重置密码
     *
     * @param username        用户名
     * @param email           邮箱
     * @param password        密码
     * @param confirmPassword 确认密码
     * @return 重置结果
     */
    ServiceResult<SysUserDTO> reset(String username, String email, String password, String confirmPassword);

    ServiceResult<SysUserDTO> update(Long currentUserId, Map<String, Object> params);
}
