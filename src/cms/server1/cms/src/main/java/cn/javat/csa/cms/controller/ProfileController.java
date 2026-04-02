package cn.javat.csa.cms.controller;


import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.dto.SysUserDTO;
import cn.javat.csa.cms.entity.BizPost;
import cn.javat.csa.cms.entity.SysUser;
import cn.javat.csa.cms.service.SysUserService;
import cn.javat.csa.cms.util.ResponseUtil;
import jakarta.websocket.server.PathParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final SysUserService sysUserService;

    public ProfileController(SysUserService sysUserService) {
        this.sysUserService = sysUserService;
    }

    /**
     * 更新用户个人信息(从Attribute中获取当前用户ID)
     *
     * @return 更新结果
     */
    @PutMapping
    public ResponseEntity<ResponseBody<SysUserDTO>> update(
            @RequestAttribute Long currentUserId,
            @RequestBody Map<String, Object> params
    ) {
        ServiceResult<SysUserDTO> update = sysUserService.update(currentUserId, params);
        if (update.isSuccess()) {
            return ResponseUtil.ok(update.getData());
        } else {
            return ResponseUtil.bad(update.getCode(), update.getMessage());
        }
    }
}
