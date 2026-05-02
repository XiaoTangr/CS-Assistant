package cn.javat.csa.cms.modules.sys.notice.service.impl;

import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.common.enums.SysUserRole;
import cn.javat.csa.cms.common.base.dto.PageQueryDTO;
import cn.javat.csa.cms.modules.sys.notice.dto.SysNoticeDTO;

import cn.javat.csa.cms.modules.sys.notice.service.SysNoticeService;
import cn.javat.csa.cms.modules.sys.notice.vo.SysNoticeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

@Service
public class SysNoticeServiceImpl implements SysNoticeService {

    @Override
    public ServiceResult<Page<SysNoticeVO>> list(PageQueryDTO pageParams, Long userId, SysUserRole userRole) {
        return null;
    }

    /**
     * @param sysNoticeId 公告ID
     * @return 公告信息
     */
    @Override
    public ServiceResult<SysNoticeDTO> getById(Long sysNoticeId) {
        return null;
    }
}
