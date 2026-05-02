package cn.javat.csa.cms.modules.sys.user.controller;


import cn.javat.csa.cms.common.base.ResponseBody;
import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.modules.sys.user.dto.SysUserUpdateDTO;
import cn.javat.csa.cms.modules.sys.user.service.SysUserService;
import cn.javat.csa.cms.common.util.ResponseUtil;
import cn.javat.csa.cms.modules.sys.user.vo.SysUserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ResponseBody<SysUserVO>> update(
            @RequestAttribute Long currentUserId,
            @RequestBody SysUserUpdateDTO dto
    ) {
        ServiceResult<SysUserVO> update = sysUserService.update(currentUserId, dto);
        if (update.isSuccess()) {
            return ResponseUtil.ok(update.getData());
        } else {
            return ResponseUtil.bad(update.getCode(), update.getMessage());
        }
    }
}
