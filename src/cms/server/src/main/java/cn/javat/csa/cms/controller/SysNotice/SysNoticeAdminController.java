package cn.javat.csa.cms.controller.SysNotice;


import cn.javat.csa.cms.common.ResponseBody;
import cn.javat.csa.cms.common.ServiceResult;
import cn.javat.csa.cms.dto.Sys.SysNotice.SysNoticeDTO;
import cn.javat.csa.cms.service.SysNoticeService;
import cn.javat.csa.cms.util.ResponseUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/notice")
public class SysNoticeAdminController {

    private final SysNoticeService sysNoticeService;


    @Autowired
    public SysNoticeAdminController(SysNoticeService sysNoticeService) {
        this.sysNoticeService = sysNoticeService;
    }


    //    更新公告
    @PutMapping("/{id}")
    public ResponseEntity<ResponseBody<Void>> update(
            @NotBlank(message = "公告ID不能为空") @PathVariable Long id,
            @Valid @RequestBody SysNoticeDTO sysNoticeDTO,
            @NotBlank(message = "用户角色不能为空") @RequestAttribute String userRole
    ) {
        // TODO: 更新公告逻辑
        return ResponseUtil.ok(id.toString());
    }


//    查询列表

    /**
     * 查询详情
     *
     * @param id 公告ID
     * @return 详情
     */
    @GetMapping()
    public ResponseEntity<ResponseBody<SysNoticeDTO>> getById(
            @NotBlank(message = "公告ID不能为空") @RequestParam Long id
    ) {
        // TODO: 查询详情逻辑
        ServiceResult<SysNoticeDTO> result = sysNoticeService.getById(id);
        return null;
    }

    /**
     * 管理员新建公告
     *
     * @param sysNoticeDTO 公告信息
     */
    @PostMapping()
    public ResponseEntity<ResponseBody<Void>> create(
            @Valid @RequestBody SysNoticeDTO sysNoticeDTO
    ) {
        // TODO: 添加公告逻辑
        return ResponseUtil.ok("ok");
    }

    /**
     * 管理员删除公告
     *
     * @param noticeId 公告ID
     */
    @DeleteMapping("/{noticeId}")
    public ResponseEntity<ResponseBody<Void>> delete(
            @PathVariable @NotBlank(message = "公告ID不能为空") Long noticeId
    ) {
        // TODO: 删除公告逻辑
        return ResponseUtil.ok(noticeId.toString());
    }

}
