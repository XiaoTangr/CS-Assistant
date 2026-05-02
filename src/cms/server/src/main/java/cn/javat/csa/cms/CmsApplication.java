package cn.javat.csa.cms;


import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.server.servlet.context.ServletComponentScan;

@SpringBootApplication
@MapperScan({"cn.javat.csa.cms.modules.*.*.mapper"})
@ServletComponentScan // 扫描 Filter、Servlet、Listener 等组件
public class CmsApplication {
    static Logger logger = org.slf4j.LoggerFactory.getLogger(CmsApplication.class);


    public static void main(String[] args) {
        var app = SpringApplication.run(CmsApplication.class, args);
        // 获取启动端口
        String port = app.getEnvironment().getProperty("server.port", "8080");
        logger.info("启动成功: http://localhost:{}", port);
    }

}
