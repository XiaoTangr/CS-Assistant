package cn.javat.csa.cms.dto;

import cn.javat.csa.cms.common.enums.BizPostType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 业务文章表数据传输对象
 * 用于接收前端提交的创建/更新请求
 */
@Data
public class BizPostDTO {

    /**
     * 标题（必填）
     */
    private String title;

    /**
     * 类型（必填）
     */
    private BizPostType type;

    /**
     * 内容（支持 HTML/MD）
     */
    private String content;

    /**
     * 文章状态 -2 违规 -1 审核中 0 正常 1 草稿
     * 新增时默认为 -1（审核中）或 1（草稿）
     */
    private Integer status;

    /**
     * 置顶权重 越大越重（可选，默认 0）
     */
    private Integer topOrder;
}
