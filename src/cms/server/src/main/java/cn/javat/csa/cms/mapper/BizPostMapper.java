package cn.javat.csa.cms.mapper;

import cn.javat.csa.cms.entity.Biz.BizPost;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Mapper;

/**
 * 业务文章表 Mapper 接口
 */
@Mapper
@CacheNamespace
public interface BizPostMapper extends BaseMapper<BizPost> {
}
