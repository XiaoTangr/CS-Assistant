package cn.javat.csa.cms;

import cn.javat.csa.cms.common.util.PasswordUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CmsApplicationTests {

    @Test
    void contextLoads() {
        System.out.println("测试");
        System.out.println(
                PasswordUtil.encode("123456")
        );
    }

}
