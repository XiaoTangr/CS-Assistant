package cn.javat.csa.cms.modules.biz.post.service.impl;

import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.common.enums.ServiceResCode;
import cn.javat.csa.cms.common.enums.SortField;
import cn.javat.csa.cms.common.enums.SortOrder;
import cn.javat.csa.cms.modules.biz.post.dto.BizPostDTO;
import cn.javat.csa.cms.modules.biz.post.service.BizPostService;
import cn.javat.csa.cms.common.base.dto.PageQueryDTO;
import cn.javat.csa.cms.modules.biz.post.po.BizPostPO;
import cn.javat.csa.cms.modules.sys.user.po.SysUserPO;
import cn.javat.csa.cms.modules.biz.post.mapper.BizPostMapper;
import cn.javat.csa.cms.modules.sys.user.mapper.SysUserMapper;
import cn.javat.csa.cms.common.util.ConvertUtil;
import cn.javat.csa.cms.modules.biz.post.vo.BizPostDetailVO;
import cn.javat.csa.cms.modules.biz.post.vo.BizPostVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    /**
     * 管理员分页查询全站文章（支持状态筛选）
     */
    @Override
    public ServiceResult<Page<BizPostVO>> listAllPosts(PageQueryDTO pageQueryDTO, Integer status, Boolean isDraft) {
        Page<BizPostPO> postPage = new Page<>(pageQueryDTO.getPage(), pageQueryDTO.getSize());
        LambdaQueryWrapper<BizPostPO> wrapper = buildQueryWrapper(null, status, isDraft, pageQueryDTO);

        Page<BizPostPO> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 VO 并填充作者信息
        Page<BizPostVO> voPage = convertToVOPage(result);

        return ServiceResult.<Page<BizPostVO>>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(voPage).build();
    }

    @Override
    public ServiceResult<BizPostDetailVO> getPostById(Long id, Long currentUserId) {
        BizPostPO post = bizPostMapper.selectById(id);
        if (post == null) {
            return ServiceResult.<BizPostDetailVO>builder().code(ServiceResCode.RESOURCE_NOT_FOUND.getCode()).isSuccess(false).message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage()).build();
        }

        // 查询作者信息并转换
        SysUserPO author = sysUserMapper.selectById(post.getUserId());
        BizPostDetailVO detailVO = ConvertUtil.toBizPostDetailVO(post, author);

        return ServiceResult.<BizPostDetailVO>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(detailVO).build();
    }

    /**
     * 分页查询指定用户的公开文章
     */
    @Override
    public ServiceResult<Page<BizPostVO>> listUserPublicPosts(Long userId, PageQueryDTO pageQueryDTO) {
        Page<BizPostPO> postPage = new Page<>(pageQueryDTO.getPage(), pageQueryDTO.getSize());
        LambdaQueryWrapper<BizPostPO> wrapper = buildQueryWrapper(userId, 0, false, pageQueryDTO);

        Page<BizPostPO> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 VO 并填充作者信息
        Page<BizPostVO> voPage = convertToVOPage(result);

        return ServiceResult.<Page<BizPostVO>>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(voPage).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> createPost(BizPostPO post, Long currentUserId) {
        post.setUserId(currentUserId);
        post.setCreateTime(LocalDateTime.now());
        post.setUpdateTime(LocalDateTime.now());

        //未提供参数值时设置默认值 Draft=false Status=-1 TopOrder=0
        post.setIsDraft(Optional.ofNullable(post.getIsDraft()).orElse(false));
        post.setStatus(Optional.ofNullable(post.getStatus()).orElse(-1));
        post.setTopOrder(Optional.ofNullable(post.getTopOrder()).orElse(0));

        bizPostMapper.insert(post);
        return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(ConvertUtil.toBizPostDTO(post)).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> updateMyPost(Long id, BizPostPO post, Long currentUserId) {
        BizPostPO existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.RESOURCE_NOT_FOUND.getCode()).isSuccess(false).message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage()).build();
        }

        if (!existing.getUserId().equals(currentUserId)) {
            return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.NO_PERMISSION.getCode()).isSuccess(false).message(ServiceResCode.NO_PERMISSION.getMessage()).build();
        }

        post.setId(id);
        post.setUpdateTime(LocalDateTime.now());
        bizPostMapper.updateById(post);

        return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(ConvertUtil.toBizPostDTO(existing)).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<Void> deleteMyPost(Long id, Long currentUserId) {
        BizPostPO existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<Void>builder().code(ServiceResCode.RESOURCE_NOT_FOUND.getCode()).isSuccess(false).message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage()).build();
        }

        if (!existing.getUserId().equals(currentUserId)) {
            return ServiceResult.<Void>builder().code(ServiceResCode.NO_PERMISSION.getCode()).isSuccess(false).message(ServiceResCode.NO_PERMISSION.getMessage()).build();
        }

        bizPostMapper.deleteById(id);

        return ServiceResult.<Void>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).build();
    }

    /**
     * 分页查询本人所有文章（支持状态筛选）
     */
    @Override
    public ServiceResult<Page<BizPostVO>> listMyPosts(Long currentUserId, PageQueryDTO pageQueryDTO, Integer status, Boolean isDraft) {
        Page<BizPostPO> postPage = new Page<>(pageQueryDTO.getPage(), pageQueryDTO.getSize());
        LambdaQueryWrapper<BizPostPO> wrapper = buildQueryWrapper(currentUserId, status, isDraft, pageQueryDTO);

        Page<BizPostPO> result = bizPostMapper.selectPage(postPage, wrapper);

        // 转换为 VO 并填充作者信息
        Page<BizPostVO> voPage = convertToVOPage(result);

        return ServiceResult.<Page<BizPostVO>>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(voPage).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> updatePostStatus(Long id, Integer status, boolean isDraft, Integer topOrder, Long currentUserId) {
        BizPostPO existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.RESOURCE_NOT_FOUND.getCode()).isSuccess(false).message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage()).build();
        }

        if (status != null) {
            existing.setStatus(status);
        }

        existing.setIsDraft(isDraft);

        if (topOrder != null) {
            existing.setTopOrder(topOrder);
        }

        existing.setUpdateTime(LocalDateTime.now());
        bizPostMapper.updateById(existing);

        return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(ConvertUtil.toBizPostDTO(existing)).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<BizPostDTO> adminUpdatePost(Long id, BizPostPO post, Long currentUserId) {
        BizPostPO existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.RESOURCE_NOT_FOUND.getCode()).isSuccess(false).message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage()).build();
        }

        post.setId(id);
        post.setUpdateTime(LocalDateTime.now());
        bizPostMapper.updateById(post);

        return ServiceResult.<BizPostDTO>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).data(ConvertUtil.toBizPostDTO(post)).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ServiceResult<Void> adminDeletePost(Long id, Long currentUserId) {
        BizPostPO existing = bizPostMapper.selectById(id);
        if (existing == null) {
            return ServiceResult.<Void>builder().code(ServiceResCode.RESOURCE_NOT_FOUND.getCode()).isSuccess(false).message(ServiceResCode.RESOURCE_NOT_FOUND.getMessage()).build();
        }

        bizPostMapper.deleteById(id);

        return ServiceResult.<Void>builder().code(ServiceResCode.SUCCESS.getCode()).isSuccess(true).message(ServiceResCode.SUCCESS.getMessage()).build();
    }

    /**
     * 构建查询条件
     */
    private LambdaQueryWrapper<BizPostPO> buildQueryWrapper(Long userId, Integer status, Boolean isDraft, PageQueryDTO pageQueryDTO) {
        LambdaQueryWrapper<BizPostPO> wrapper = new LambdaQueryWrapper<>();

        if (userId != null) {
            wrapper.eq(BizPostPO::getUserId, userId);
        }

        if (status != null) {
            wrapper.eq(BizPostPO::getStatus, status);
        }

        if (isDraft != null) {
            wrapper.eq(BizPostPO::getIsDraft, isDraft);
        }

        // 注意：@TableLogic 会自动添加 is_delete=0 条件，只查询未删除数据

        // 如果关键词不为空则模糊匹配标题和内容
        String keyword = pageQueryDTO.getKeyword();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(BizPostPO::getTitle, keyword).or().like(BizPostPO::getContent, keyword));
        }

        // 处理动态排序
        SortField sort = pageQueryDTO.getSortField();
        SortOrder sortOrder = pageQueryDTO.getSortOrderEnum();
                
        if (sort == SortField.DEFAULT) {
            // 默认排序:topOrder 降序为第一排序,updateTime 降序为第二排序
            wrapper.orderByDesc(BizPostPO::getTopOrder)
                   .orderByDesc(BizPostPO::getUpdateTime);
        } else {
            // 按指定字段排序,受 sortOrder 控制
            boolean isAsc = sortOrder == SortOrder.ASC;
            switch (sort) {
                case CREATE_TIME:
                    wrapper.orderBy(true, isAsc, BizPostPO::getCreateTime);
                    break;
                case UPDATE_TIME:
                    wrapper.orderBy(true, isAsc, BizPostPO::getUpdateTime);
                    break;
                default:
                    wrapper.orderByDesc(BizPostPO::getCreateTime);
            }
        }

        return wrapper;
    }

    /**
     * 将 BizPostPO 分页结果转换为 BizPostVO 分页结果（包含作者简要信息）
     */
    private Page<BizPostVO> convertToVOPage(Page<BizPostPO> postPage) {
        List<BizPostPO> posts = postPage.getRecords();

        // 批量查询作者信息
        List<Long> userIds = posts.stream().map(BizPostPO::getUserId).distinct().collect(Collectors.toList());

        Map<Long, SysUserPO> userMap = userIds.isEmpty() ? Map.of() : sysUserMapper.selectBatchIds(userIds).stream().collect(Collectors.toMap(SysUserPO::getId, u -> u));

        // 转换为 VO
        List<BizPostVO> voList = posts.stream().map(post -> {
            SysUserPO author = userMap.get(post.getUserId());
            return ConvertUtil.toBizPostVO(post, author);
        }).collect(Collectors.toList());

        // 构建分页结果
        Page<BizPostVO> voPage = new Page<>(postPage.getCurrent(), postPage.getSize(), postPage.getTotal());
        voPage.setRecords(voList);

        return voPage;
    }
}
