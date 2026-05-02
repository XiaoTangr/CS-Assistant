package cn.javat.csa.cms.config;

import cn.javat.csa.cms.common.interceptor.AuthenticationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC 配置 - 注册拦截器
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

//    private final AuthenticationInterceptor authenticationInterceptor;

//    @Autowired
//    public WebMvcConfig(AuthenticationInterceptor authenticationInterceptor) {
//        this.authenticationInterceptor = authenticationInterceptor;
//    }

//    /**
//     * 添加自定义拦截器
//     */
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        // 使用注入的 Bean,而不是创建新实例
//        registry.addInterceptor(authenticationInterceptor)
//                .addPathPatterns("/**");
//    }


    //    注册Filter
}
