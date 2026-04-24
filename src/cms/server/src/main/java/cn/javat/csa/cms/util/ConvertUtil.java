package cn.javat.csa.cms.util;

import cn.javat.csa.cms.dto.Biz.BizPost.BizPostDTO;
import cn.javat.csa.cms.dto.Sys.SysNotice.SysNoticeDTO;
import cn.javat.csa.cms.entity.Biz.BizPost;
import cn.javat.csa.cms.entity.Sys.SysNotice;
import cn.javat.csa.cms.entity.Sys.SysUser;
import cn.javat.csa.cms.vo.Biz.BizPostDetailVO;
import cn.javat.csa.cms.vo.Biz.BizPostVO;
import cn.javat.csa.cms.vo.Sys.SysNoticeVO;
import cn.javat.csa.cms.vo.Sys.SysUserVO;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.stream.Collectors;


/**
 * 实体类到 DTO/VO 转换工具类，提供静态方法实现相互转换
 */
public class ConvertUtil {

    /**
     * 将 BizPost 实体转换为 BizPostDTO
     *
     * @param post 业务文章实体
     * @return 业务文章 DTO
     */
    public static BizPostDTO toBizPostDTO(BizPost post) {
        if (post == null) {
            return null;
        }
        BizPostDTO dto = new BizPostDTO();
        BeanUtils.copyProperties(post, dto);
        return dto;
    }

    /**
     * 将 BizPost 实体列表转换为 BizPostDTO 列表
     *
     * @param posts 业务文章实体列表
     * @return 业务文章 DTO 列表
     */
    public static List<BizPostDTO> toBizPostDTOList(List<BizPost> posts) {
        if (posts == null) {
            return null;
        }
        return posts.stream()
                .map(ConvertUtil::toBizPostDTO)
                .collect(Collectors.toList());
    }

    /**
     * 将 BizPost 实体转换为 BizPostVO（包含作者简要信息）
     *
     * @param post   业务文章实体
     * @param author 作者用户实体
     * @return 业务文章 VO
     */
    public static BizPostVO toBizPostVO(BizPost post, SysUser author) {
        if (post == null) {
            return null;
        }
        BizPostVO vo = BizPostVO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .type(post.getType())
                .contentSummary(post.getContent() != null && post.getContent().length() > 200 
                        ? post.getContent().substring(0, 200) + "..." 
                        : post.getContent())
                .status(post.getStatus())
                .isDraft(post.getIsDraft())
                .topOrder(post.getTopOrder())
                .userId(post.getUserId())
                .authorNickname(author != null ? author.getNickname() : null)
                .authorAvatar(author != null ? author.getAvatar() : null)
                .createTime(post.getCreateTime())
                .updateTime(post.getUpdateTime())
                .build();
        return vo;
    }

    /**
     * 将 BizPost 实体和 SysUser 实体转换为 BizPostDetailVO
     *
     * @param post   业务文章实体
     * @param author 作者用户实体
     * @return 业务文章详情 VO
     */
    public static BizPostDetailVO toBizPostDetailVO(BizPost post, SysUser author) {
        if (post == null) {
            return null;
        }
        BizPostDetailVO vo = BizPostDetailVO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .type(post.getType())
                .content(post.getContent())
                .status(post.getStatus())
                .isDraft(post.getIsDraft())
                .topOrder(post.getTopOrder())
                .userId(post.getUserId())
                .author(author != null ? toSysUserVO(author) : null)
                .createTime(post.getCreateTime())
                .updateTime(post.getUpdateTime())
                .build();
        return vo;
    }

    /**
     * 将 SysUser 实体转换为 SysUserVO
     *
     * @param sysUser 系统用户实体
     * @return 系统用户 VO
     */
    public static SysUserVO toSysUserVO(SysUser sysUser) {
        if (sysUser == null) {
            return null;
        }
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

    /**
     * 将 BizPostDTO 转换为 BizPost 实体
     *
     * @param dto 业务文章 DTO
     * @return 业务文章实体
     */
    public static BizPost toBizPost(BizPostDTO dto) {
        if (dto == null) {
            return null;
        }
        BizPost post = new BizPost();
        BeanUtils.copyProperties(dto, post);
        return post;
    }

    /**
     * 将 SysNotice 实体转换为 SysNoticeDTO
     *
     * @param notice 系统公告实体
     * @return 系统公告 DTO
     */
    public static SysNoticeDTO toSysNoticeDTO(SysNotice notice) {
        if (notice == null) {
            return null;
        }
        SysNoticeDTO dto = new SysNoticeDTO();
        BeanUtils.copyProperties(notice, dto);
        return dto;
    }

    /**
     * 将 SysNotice 实体转换为 SysNoticeVO
     *
     * @param notice 系统公告实体
     * @return 系统公告 VO
     */
    public static SysNoticeVO toSysNoticeVO(SysNotice notice) {
        if (notice == null) {
            return null;
        }
        SysNoticeVO vo = new SysNoticeVO();
        BeanUtils.copyProperties(notice, vo);
        return vo;
    }

    /**
     * 将 SysNoticeDTO 转换为 SysNotice 实体
     *
     * @param dto 系统公告 DTO
     * @return 系统公告实体
     */
    public static SysNotice toSysNotice(SysNoticeDTO dto) {
        if (dto == null) {
            return null;
        }
        SysNotice notice = new SysNotice();
        BeanUtils.copyProperties(dto, notice);
        return notice;
    }
}
