package cn.javat.csa.cms.service.impl;

import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.common.enums.SysUserRole;
import cn.javat.csa.cms.dto.PaginationParamDTO;
import cn.javat.csa.cms.dto.Sys.SysNotice.SysNoticeDTO;
import cn.javat.csa.cms.service.SysNoticeService;
import cn.javat.csa.cms.vo.Sys.SysNoticeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

@Service
public class SysNoticeServiceImpl implements SysNoticeService {

    @Override
    public ServiceResult<Page<SysNoticeVO>> list(PaginationParamDTO pageParams, Long userId, SysUserRole userRole) {
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
