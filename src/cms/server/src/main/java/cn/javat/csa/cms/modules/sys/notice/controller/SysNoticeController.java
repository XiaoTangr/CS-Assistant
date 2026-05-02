package cn.javat.csa.cms.modules.sys.notice.controller;


import cn.javat.csa.cms.common.base.ResponseBody;
import cn.javat.csa.cms.common.base.ServiceResult;
import cn.javat.csa.cms.modules.sys.notice.dto.SysNoticeDTO;

import cn.javat.csa.cms.modules.sys.notice.service.SysNoticeService;
import cn.javat.csa.cms.common.util.ResponseUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notice")
public class SysNoticeController {

    private final SysNoticeService sysNoticeService;


    @Autowired
    public SysNoticeController(SysNoticeService sysNoticeService) {
        this.sysNoticeService = sysNoticeService;
    }


    //    更新公告
    @PutMapping("/{id}")
    public ResponseEntity<ResponseBody<Void>> update(
            @NotBlank(message = "公告ID不能为空") @PathVariable Long id,
            @Valid @RequestBody SysNoticeDTO sysNoticeDTO,
            @NotBlank(message = "用户角色不能为空") @RequestAttribute String userRole
    ) {
        throw new UnsupportedOperationException("Not implemented");
        // TODO: 更新公告逻辑
//        return ResponseUtil.ok(id.toString());
    }


//    查询列表

    /**
     * 查询详情
     *
     * @param id 公告ID
     * @return 详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResponseBody<SysNoticeDTO>> getById(
            @PathVariable @NotBlank(message = "公告ID不能为空") Long id
    ) {
        // TODO: 查询详情逻辑
        ServiceResult<SysNoticeDTO> result = sysNoticeService.getById(id);
        throw new NotImplementedException("你看看我呢" + id);
//        return null;
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
