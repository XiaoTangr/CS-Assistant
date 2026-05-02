package cn.javat.csa.cms.modules.sys.rbac.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 权限相关接口
 */

@RestController
@RequestMapping("/api/v1/permission")
public class PermissionController {

    /**
     * 权限列表
     *
     * @return 权限列表
     */
    @GetMapping("/list")
    public String list() {
        return "权限列表";
    }
}
