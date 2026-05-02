package cn.javat.csa.cms.modules.sys.notice.service;

import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.common.enums.SysUserRole;
import cn.javat.csa.cms.common.base.dto.PageQueryDTO;
import cn.javat.csa.cms.modules.sys.notice.dto.SysNoticeDTO;
import cn.javat.csa.cms.modules.sys.notice.vo.SysNoticeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface SysNoticeService {
//    --------------------------- 查询 -------------------------


    //    分页查询

    /**
     * 分页查询
     *
     * @param pageParams 分页参数
     * @return 分页结果
     */
    ServiceResult<Page<SysNoticeVO>> list(PageQueryDTO pageParams, Long userId, SysUserRole userRole);

    /**
     * 查询详情
     *
     * @param sysNoticeId 公告ID
     * @return 详情
     */
    ServiceResult<SysNoticeDTO> getById(Long sysNoticeId);


//    --------------------------- 管理员 ------------------------

}
