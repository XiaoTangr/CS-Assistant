package cn.javat.csa.cms.mapper;

import cn.javat.csa.cms.entity.Sys.SysNotice;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系统通知表 Mapper 接口
 */
@Mapper
@CacheNamespace
public interface SysNoticeMapper extends BaseMapper<SysNotice> {
    
}
