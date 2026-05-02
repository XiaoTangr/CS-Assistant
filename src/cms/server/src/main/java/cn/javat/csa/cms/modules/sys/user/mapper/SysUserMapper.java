package cn.javat.csa.cms.modules.sys.user.mapper;

import cn.javat.csa.cms.modules.sys.user.po.SysUserPO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系统用户表 Mapper 接口
 */
@Mapper
@CacheNamespace
public interface SysUserMapper extends BaseMapper<SysUserPO> {
}
