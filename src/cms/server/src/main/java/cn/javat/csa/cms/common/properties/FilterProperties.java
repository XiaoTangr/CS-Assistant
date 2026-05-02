package cn.javat.csa.cms.common.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "filter")
public class FilterProperties {
    /**
     * 是否启用认证过滤器
     */
    private boolean enableAuth = true; // 默认开启
    /**
     * 放行路径
     */
    private List<String> allow;

    private List<String> allowPublic;
    // 按路径+方法放行
    private Map<String, String> allowWithMethod;
}