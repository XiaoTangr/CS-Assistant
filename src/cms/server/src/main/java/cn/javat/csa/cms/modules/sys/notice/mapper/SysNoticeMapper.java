package cn.javat.csa.cms.modules.sys.notice.mapper;

import cn.javat.csa.cms.modules.sys.notice.po.SysNoticePO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系统通知表 Mapper 接口
 */
@Mapper
@CacheNamespace
public interface SysNoticeMapper extends BaseMapper<SysNoticePO> {
    
}
