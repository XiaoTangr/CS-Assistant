package cn.javat.csa.cms.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.ibatis.cache.Cache;
import org.apache.ibatis.cache.impl.PerpetualCache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Configuration
public class MyBatisPlusConfig {

    /**
     * 分页插件 3.5.x 新版配置
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页插件
        PaginationInnerInterceptor paginationInterceptor = new PaginationInnerInterceptor();
        // 设置数据库类型（根据你的数据库修改）
        paginationInterceptor.setDbType(DbType.MYSQL);
        // 溢出总页数自动跳转到第一页
        paginationInterceptor.setOverflow(true);
        // 单页限制最大条数（-1不受限制）
        paginationInterceptor.setMaxLimit(-1L);
        interceptor.addInnerInterceptor(paginationInterceptor);
        return interceptor;
    }

    /**
     * 开启 MyBatis Plus 二级缓存配置
     * 注意：需要在 Mapper 接口上添加 @CacheNamespace 注解才能生效
     */
    @Bean
    public Cache cache() {
        return new PerpetualCache("default") {
            private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

            @Override
            public ReadWriteLock getReadWriteLock() {
                return readWriteLock;
            }
        };
    }
}