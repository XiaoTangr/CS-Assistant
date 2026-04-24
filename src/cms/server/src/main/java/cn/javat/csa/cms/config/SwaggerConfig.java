package cn.javat.csa.cms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    /**
     * 配置swagger
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("API文档").version("1.0"))
                .addSecurityItem(new SecurityRequirement().addList("authorization"))
                .components(new Components()
                        .addSecuritySchemes("authorization",
                                new SecurityScheme()
                                        .name("authorization") // 请求头名字
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER) // 放在请求头
                                        .scheme("bearer")
                        )
                );
    }
}