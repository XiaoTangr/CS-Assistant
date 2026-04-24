package cn.javat.csa.cms.service.impl;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.dto.Sys.SysUser.SysUserRegisterDTO;
import cn.javat.csa.cms.dto.Sys.SysUser.SysUserUpdateDTO;
import cn.javat.csa.cms.entity.Sys.SysUser;
import cn.javat.csa.cms.mapper.SysUserMapper;
import cn.javat.csa.cms.service.SysUserService;
import cn.javat.csa.cms.util.PasswordUtil;
import cn.javat.csa.cms.vo.Sys.SysUserVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
public class SysUserServiceImpl implements SysUserService {

    SysUserMapper sysUserMapper;

    @Autowired
    public SysUserServiceImpl(SysUserMapper sysUserMapper) {
        this.sysUserMapper = sysUserMapper;
    }


    /**
     * 登录
     *
     * @param username 用户名
     * @param password 密码
     * @return 登录结果 ServiceResult<SysUserVO> code = -2 用户不存在，code = -1 密码错误，code = 0 登录成功
     */
    @Override
    public ServiceResult<SysUserVO> login(String username, String password) {
        // 使用 QueryWrapper 进行多条件查询（避免 Lambda 对 boolean 字段的识别问题）
        var wrapper = new QueryWrapper<SysUser>();
        wrapper.eq("username", username)
                .eq("is_delete", false)
                .eq("is_disable", false);

        SysUser sysUser = sysUserMapper.selectOne(wrapper);
        if (sysUser == null) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }
        if (PasswordUtil.matches(password, sysUser.getPassword())) {
            SysUserVO sysUserVO = convertToVO(sysUser);
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserVO)
                    .build();
        } else {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.PARAM_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.PARAM_ERROR.getMessage())
                    .build();
        }
    }

    /**
     * 注册
     *
     * @param dto 注册信息
     * @return 注册结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<SysUserVO> register(SysUserRegisterDTO dto) {
        var wrapper = new QueryWrapper<SysUser>();
        wrapper.eq("username", dto.getUsername())
                .eq("is_delete", false)
                .eq("is_disable", false);
        SysUser isExist = sysUserMapper.selectOne(wrapper);
        if (isExist != null) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.RESOURCE_ALREADY_EXISTS.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_ALREADY_EXISTS.getMessage())
                    .build();
        }
        if (!Objects.equals(dto.getPassword(), dto.getConfirmPassword())) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.PARAM_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.PARAM_ERROR.getMessage())
                    .build();
        }
        SysUser newSysUser = SysUser.builder()
                .username(dto.getUsername())
                .password(PasswordUtil.encode(dto.getPassword()))
                .nickname(dto.getNickname())
                .avatar(dto.getAvatar())
                .email(dto.getEmail())
                .steamId(dto.getSteamId())
                .role(0)
                .isDisable(false)
                .isDelete(false)
                .build();
        int insert = sysUserMapper.insert(newSysUser);
        if (insert > 0) {
            newSysUser = sysUserMapper.selectOne(wrapper);
            SysUserVO sysUserVO = convertToVO(newSysUser);
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserVO)
                    .build();
        } else {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SERVER_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.SERVER_ERROR.getMessage())
                    .build();
        }
    }

    /**
     * @param currentUserId 当前用户 ID
     * @return 当前用户信息
     */
    @Override
    public ServiceResult<SysUserVO> getById(Long currentUserId) {
        SysUser sysUser = sysUserMapper.selectById(currentUserId);
        if (sysUser == null) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        } else {
            SysUserVO sysUserVO = convertToVO(sysUser);
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserVO)
                    .build();
        }
    }

    /**
     * 重置密码
     *
     * @param username        用户名
     * @param email           邮箱
     * @param password        密码
     * @param confirmPassword 确认密码
     * @return 重置结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<SysUserVO> reset(String username, String email, String password, String confirmPassword) {

        var wrapper = new QueryWrapper<SysUser>();
        wrapper.eq("username", username)
                .eq("email", email)
                .eq("is_delete", false)
                .eq("is_disable", false);

        SysUser sysUser = sysUserMapper.selectOne(wrapper);
        if (sysUser == null) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }
        if (!Objects.equals(password, confirmPassword)) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.PARAM_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.PARAM_ERROR.getMessage())
                    .build();
        }
        sysUser.setPassword(PasswordUtil.encode(password));
        int update = sysUserMapper.update(sysUser, wrapper);
        if (update > 0) {
            SysUserVO sysUserVO = convertToVO(sysUser);
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserVO)
                    .build();
        }
        return ServiceResult.<SysUserVO>builder()
                .code(ServiceResCode.SERVER_ERROR.getCode())
                .isSuccess(false)
                .message(ServiceResCode.SERVER_ERROR.getMessage())
                .build();
    }

    /**
     * 更新用户个人信息
     *
     * @param currentUserId 当前用户 ID
     * @param params        参数
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<SysUserVO> update(Long currentUserId, SysUserUpdateDTO params) {
        // 先查询现有数据
        SysUser existingUser = sysUserMapper.selectById(currentUserId);
        if (existingUser == null) {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        // 只更新非空字段
        Optional.ofNullable(params.getNickname()).ifPresent(existingUser::setNickname);
        Optional.ofNullable(params.getAvatar()).ifPresent(existingUser::setAvatar);
        Optional.ofNullable(params.getEmail()).ifPresent(existingUser::setEmail);
        Optional.ofNullable(params.getSteamId()).ifPresent(existingUser::setSteamId);

        int update = sysUserMapper.updateById(existingUser);
        if (update > 0) {
            SysUserVO sysUserVO = convertToVO(existingUser);
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserVO)
                    .build();
        } else {
            return ServiceResult.<SysUserVO>builder()
                    .code(ServiceResCode.SERVER_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.SERVER_ERROR.getMessage())
                    .build();
        }
    }

    /**
     * 将 SysUser 实体转换为 SysUserVO
     *
     * @param sysUser 系统用户实体
     * @return 系统用户 VO
     */
    private SysUserVO convertToVO(SysUser sysUser) {
        return SysUserVO.builder()
                .id(sysUser.getId())
                .username(sysUser.getUsername())
                .nickname(sysUser.getNickname())
                .avatar(sysUser.getAvatar())
                .email(sysUser.getEmail())
                .steamId(sysUser.getSteamId())
                .role(sysUser.getRole())
                .isDisable(sysUser.isDisable())
                .createTime(sysUser.getCreateTime())
                .updateTime(sysUser.getUpdateTime())
                .build();
    }
}
