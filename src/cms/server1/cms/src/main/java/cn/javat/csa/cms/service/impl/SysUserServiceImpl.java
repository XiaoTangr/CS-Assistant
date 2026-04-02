package cn.javat.csa.cms.service.impl;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.dto.SysUserDTO;
import cn.javat.csa.cms.dto.SysUserRegisterDTO;
import cn.javat.csa.cms.entity.SysUser;
import cn.javat.csa.cms.mapper.SysUserMapper;
import cn.javat.csa.cms.service.SysUserService;
import cn.javat.csa.cms.util.PasswordUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

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
     * @return 登录结果 ServiceResult<SysUserDTO> code = -2 用户不存在，code = -1 密码错误，code = 0 登录成功
     */
    @Override
    public ServiceResult<SysUserDTO> login(String username, String password) {
        // 使用 QueryWrapper 进行多条件查询（避免 Lambda 对 boolean 字段的识别问题）
        var wrapper = new QueryWrapper<SysUser>();
        wrapper.eq("username", username)
                .eq("is_delete", false)
                .eq("is_disable", false);

        SysUser sysUser = sysUserMapper.selectOne(wrapper);
        if (sysUser == null) {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }
        if (PasswordUtil.matches(password, sysUser.getPassword())) {
            SysUserDTO sysUserDTO = convertToDTO(sysUser);
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserDTO)
                    .build();
        } else {
            return ServiceResult.<SysUserDTO>builder()
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
    public ServiceResult<SysUserDTO> register(SysUserRegisterDTO dto) {
        var wrapper = new QueryWrapper<SysUser>();
        wrapper.eq("username", dto.getUsername())
                .eq("is_delete", false)
                .eq("is_disable", false);
        SysUser isExist = sysUserMapper.selectOne(wrapper);
        if (isExist != null) {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.RESOURCE_ALREADY_EXISTS.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_ALREADY_EXISTS.getMessage())
                    .build();
        }
        if (!Objects.equals(dto.getPassword(), dto.getConfirmPassword())) {
            return ServiceResult.<SysUserDTO>builder()
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
            SysUserDTO sysUserDTO = convertToDTO(newSysUser);
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserDTO)
                    .build();
        } else {
            return ServiceResult.<SysUserDTO>builder()
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
    public ServiceResult<SysUserDTO> getById(Long currentUserId) {
        SysUser sysUser = sysUserMapper.selectById(currentUserId);
        if (sysUser == null) {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        } else {
            SysUserDTO sysUserDTO = convertToDTO(sysUser);
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserDTO)
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
    public ServiceResult<SysUserDTO> reset(String username, String email, String password, String confirmPassword) {

        var wrapper = new QueryWrapper<SysUser>();
        wrapper.eq("username", username)
                .eq("email", email)
                .eq("is_delete", false)
                .eq("is_disable", false);

        SysUser sysUser = sysUserMapper.selectOne(wrapper);
        if (sysUser == null) {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }
        if (!Objects.equals(password, confirmPassword)) {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.PARAM_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.PARAM_ERROR.getMessage())
                    .build();
        }
        sysUser.setPassword(PasswordUtil.encode(password));
        int update = sysUserMapper.update(sysUser, wrapper);
        if (update > 0) {
            SysUserDTO sysUserDTO = convertToDTO(sysUser);
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserDTO)
                    .build();
        }
        return ServiceResult.<SysUserDTO>builder()
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
    public ServiceResult<SysUserDTO> update(Long currentUserId, Map<String, Object> params) {
        // 先查询现有数据
        SysUser existingUser = sysUserMapper.selectById(currentUserId);
        if (existingUser == null) {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }
    
        // 只更新非空字段
        if (params.get("nickname") != null) {
            existingUser.setNickname(params.get("nickname").toString());
        }
        if (params.get("avatar") != null) {
            existingUser.setAvatar(params.get("avatar").toString());
        }
        if (params.get("email") != null) {
            existingUser.setEmail(params.get("email").toString());
        }
        if (params.get("steamId") != null) {
            // 安全地转换为 Long 类型
            Object steamIdValue = params.get("steamId");
            Long steamId;
            if (steamIdValue instanceof Number) {
                steamId = ((Number) steamIdValue).longValue();
            } else {
                try {
                    steamId = Long.parseLong(steamIdValue.toString());
                } catch (NumberFormatException e) {
                    steamId = null;
                }
            }
            if (steamId != null) {
                existingUser.setSteamId(steamId);
            }
        }
    
        int update = sysUserMapper.updateById(existingUser);
        if (update > 0) {
            SysUserDTO sysUserDTO = convertToDTO(existingUser);
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.SUCCESS.getCode())
                    .isSuccess(true)
                    .message(ServiceResCode.SUCCESS.getMessage())
                    .data(sysUserDTO)
                    .build();
        } else {
            return ServiceResult.<SysUserDTO>builder()
                    .code(ServiceResCode.SERVER_ERROR.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.SERVER_ERROR.getMessage())
                    .build();
        }
    }
    
    /**
     * 将 SysUser 实体转换为 SysUserDTO
     *
     * @param sysUser 系统用户实体
     * @return 系统用户 DTO
     */
    private SysUserDTO convertToDTO(SysUser sysUser) {
        return SysUserDTO.builder()
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
