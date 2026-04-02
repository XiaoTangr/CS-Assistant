package cn.javat.csa.cms.service.impl;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.dto.BizPostDTO;
import cn.javat.csa.cms.dto.BizPostDetailDTO;
import cn.javat.csa.cms.dto.SysUserDTO;
import cn.javat.csa.cms.entity.BizPost;
import cn.javat.csa.cms.entity.SysUser;
import cn.javat.csa.cms.mapper.BizPostMapper;
import cn.javat.csa.cms.mapper.SysUserMapper;
import cn.javat.csa.cms.service.BizPostService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BizPostServiceImpl implements BizPostService {

    BizPostMapper bizPostMapper;
    SysUserMapper sysUserMapper;

    @Autowired
    public void setBizPostMapper(BizPostMapper bizPostMapper) {
        this.bizPostMapper = bizPostMapper;
    }

    @Autowired
    public void setSysUserMapper(SysUserMapper sysUserMapper) {
        this.sysUserMapper = sysUserMapper;
    }

    @Override
    public ServiceResult<Page<BizPostDTO>> listPublicPosts(int page, int size, String keyword, String sort) {
        Page<BizPost> postPage = new Page<>(page, size);
        LambdaQueryWrapper<BizPost> wrapper = new LambdaQueryWrapper<>();

        // 只查询已发布文章 (status=0)
        wrapper.eq(BizPost::getStatus, 0);

        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w
                    .like(BizPost::getTitle, keyword)
                    .or()
                    .like(BizPost::getContent, keyword)
            );
        }


        // 排序：优先按置顶权重降序，再按创建时间降序
        wrapper.orderByDesc(BizPost::getTopOrder)
                .orderByDesc(BizPost::getCreateTime);

        Page<BizPost> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 DTO 列表
        Page<BizPostDTO> dtoPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
        dtoPage.setRecords(result.getRecords().stream()
                .map(this::convertToDTO)
                .toList());

        return ServiceResult.<Page<BizPostDTO>>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(dtoPage)
                .build();
    }

    @Override
    public ServiceResult<BizPostDetailDTO> getPostById(Long id, Long currentUserId) {
        BizPost post = bizPostMapper.selectById(id);
        if (post == null) {
            return ServiceResult.<BizPostDetailDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        // TODO: 浏览量 +1（需要添加对应字段）
        // 暂时不增加浏览量统计

        // 查询作者信息
        SysUser author = sysUserMapper.selectById(post.getUserId());
        SysUserDTO authorDTO = author != null ? convertUserToDTO(author) : null;

        // 构建详情 DTO
        BizPostDetailDTO detailDTO = BizPostDetailDTO.builder()
                .title(post.getTitle())
                .type(post.getType())
                .content(post.getContent())
                .status(post.getStatus())
                .topOrder(post.getTopOrder())
                .author(authorDTO)
                .build();

        return ServiceResult.<BizPostDetailDTO>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(detailDTO)
                .build();
    }

    @Override
    public ServiceResult<Page<BizPostDTO>> listUserPublicPosts(Long userId, int page, int size, String keyword, String sort) {
        Page<BizPost> postPage = new Page<>(page, size);
        LambdaQueryWrapper<BizPost> wrapper = new LambdaQueryWrapper<>();

        wrapper.eq(BizPost::getUserId, userId)
                .eq(BizPost::getStatus, 0); // 只查询公开内容

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(BizPost::getTitle, keyword);
        }

        // 排序：优先按置顶权重降序，再按创建时间降序
        wrapper.orderByDesc(BizPost::getTopOrder)
                .orderByDesc(BizPost::getCreateTime);

        Page<BizPost> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 DTO 列表
        Page<BizPostDTO> dtoPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
        dtoPage.setRecords(result.getRecords().stream()
                .map(this::convertToDTO)
                .toList());

        return ServiceResult.<Page<BizPostDTO>>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(dtoPage)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> createPost(BizPost post, Long currentUserId) {
        post.setUserId(currentUserId);
        post.setCreateTime(LocalDateTime.now());
        post.setUpdateTime(LocalDateTime.now());

        // 默认状态为审核中 (-1) 或草稿 (1)
        if (post.getStatus() == null) {
            post.setStatus(-1);
        }

        // 默认定置权重为 0
        if (post.getTopOrder() == null) {
            post.setTopOrder(0);
        }

        bizPostMapper.insert(post);
        return ServiceResult.<BizPostDTO>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(convertToDTO(post))
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> updateMyPost(Long id, BizPost post, Long currentUserId) {
        BizPost existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<BizPostDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        // 验证是否为作者本人
        if (!existing.getUserId().equals(currentUserId)) {
            return ServiceResult.<BizPostDTO>builder()
                    .code(ServiceResCode.NO_PERMISSION.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.NO_PERMISSION.getMessage())
                    .build();
        }

        post.setId(id);
        post.setUpdateTime(LocalDateTime.now());
        bizPostMapper.updateById(post);

        return ServiceResult.<BizPostDTO>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(convertToDTO(post))
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<Void> deleteMyPost(Long id, Long currentUserId) {
        BizPost existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<Void>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        // 验证是否为作者本人
        if (!existing.getUserId().equals(currentUserId)) {
            return ServiceResult.<Void>builder()
                    .code(ServiceResCode.NO_PERMISSION.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.NO_PERMISSION.getMessage())
                    .build();
        }

        // 使用 MyBatis-Plus 的逻辑删除方法，自动设置 is_delete=1
        bizPostMapper.deleteById(id);

        return ServiceResult.<Void>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .build();
    }

    @Override
    public ServiceResult<Page<BizPostDTO>> listMyPosts(Long currentUserId, int page, int size, String keyword, String sort) {
        Page<BizPost> postPage = new Page<>(page, size);
        LambdaQueryWrapper<BizPost> wrapper = new LambdaQueryWrapper<>();

        wrapper.eq(BizPost::getUserId, currentUserId);

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(BizPost::getTitle, keyword);
        }

        // 排序：优先按置顶权重降序，再按创建时间降序
        wrapper.orderByDesc(BizPost::getTopOrder)
                .orderByDesc(BizPost::getCreateTime);

        Page<BizPost> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 DTO 列表
        Page<BizPostDTO> dtoPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
        dtoPage.setRecords(result.getRecords().stream()
                .map(this::convertToDTO)
                .toList());

        return ServiceResult.<Page<BizPostDTO>>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(dtoPage)
                .build();
    }

    @Override
    public ServiceResult<Page<BizPostDTO>> listAllPosts(int page, int size, String keyword, String sort, String status) {
        Page<BizPost> postPage = new Page<>(page, size);
        LambdaQueryWrapper<BizPost> wrapper = new LambdaQueryWrapper<>();

        // 状态筛选
        if (status != null && !status.isEmpty() && !"all".equals(status)) {
            switch (status) {
                case "published":
                    wrapper.eq(BizPost::getStatus, 0);
                    break;
                case "audit":
                    wrapper.eq(BizPost::getStatus, -1);
                    break;
                case "reject":
                    wrapper.eq(BizPost::getStatus, -2);
                    break;
            }
        }

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(BizPost::getTitle, keyword);
        }

        // 排序：优先按置顶权重降序，再按创建时间降序
        wrapper.orderByDesc(BizPost::getTopOrder)
                .orderByDesc(BizPost::getCreateTime);

        Page<BizPost> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 DTO 列表
        Page<BizPostDTO> dtoPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
        dtoPage.setRecords(result.getRecords().stream()
                .map(this::convertToDTO)
                .toList());

        return ServiceResult.<Page<BizPostDTO>>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(dtoPage)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> updatePostStatus(Long id, Integer status, Integer topOrder, Long currentUserId) {
        BizPost existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<BizPostDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        if (status != null) {
            existing.setStatus(status);
        }

        // 处理置顶权重：直接使用传入的 topOrder 值
        if (topOrder != null) {
            existing.setTopOrder(topOrder);
        }

        existing.setUpdateTime(LocalDateTime.now());
        bizPostMapper.updateById(existing);

        return ServiceResult.<BizPostDTO>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(convertToDTO(existing))
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> adminUpdatePost(Long id, BizPost post, Long currentUserId) {
        BizPost existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<BizPostDTO>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        post.setId(id);
        post.setUpdateTime(LocalDateTime.now());
        bizPostMapper.updateById(post);

        return ServiceResult.<BizPostDTO>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .data(convertToDTO(post))
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<Void> adminDeletePost(Long id, Long currentUserId) {
        BizPost existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<Void>builder()
                    .code(ServiceResCode.RESOURCE_NOT_FOUND.getCode())
                    .isSuccess(false)
                    .message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage())
                    .build();
        }

        // 使用 MyBatis-Plus 的逻辑删除方法，自动设置 is_delete=1
        bizPostMapper.deleteById(id);

        return ServiceResult.<Void>builder()
                .code(ServiceResCode.SUCCESS.getCode())
                .isSuccess(true)
                .message(ServiceResCode.SUCCESS.getMessage())
                .build();
    }

    /**
     * 将 BizPost 实体转换为 BizPostDTO
     *
     * @param post 业务文章实体
     * @return 业务文章 DTO
     */
    private BizPostDTO convertToDTO(BizPost post) {
        BizPostDTO dto = new BizPostDTO();
        dto.setTitle(post.getTitle());
        dto.setType(post.getType());
        dto.setContent(post.getContent());
        dto.setStatus(post.getStatus());
        dto.setTopOrder(post.getTopOrder());
        return dto;
    }

    /**
     * 将 SysUser 实体转换为 SysUserDTO
     *
     * @param sysUser 系统用户实体
     * @return 系统用户 DTO
     */
    private SysUserDTO convertUserToDTO(SysUser sysUser) {
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
