package cn.javat.csa.cms.modules.sys.user.service;

import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.modules.sys.user.dto.SysUserRegisterDTO;
import cn.javat.csa.cms.modules.sys.user.dto.SysUserUpdateDTO;
import cn.javat.csa.cms.modules.sys.user.vo.SysUserVO;

public interface SysUserService {
    /**
     * 登录
     *
     * @param username 用户名
     * @param password 密码
     * @return 登录结果
     */
    ServiceResult<SysUserVO> login(String username, String password);

    /**
     * 注册
     *
     * @param dto 注册信息
     * @return 注册结果
     */
    ServiceResult<SysUserVO> register(SysUserRegisterDTO dto);

    ServiceResult<SysUserVO> getById(Long currentUserId);

    /**
     * 重置密码
     *
     * @param username        用户名
     * @param email           邮箱
     * @param password        密码
     * @param confirmPassword 确认密码
     * @return 重置结果
     */
    ServiceResult<SysUserVO> reset(String username, String email, String password, String confirmPassword);

    ServiceResult<SysUserVO> update(Long currentUserId, SysUserUpdateDTO sysUserUpdateDTO);
}
