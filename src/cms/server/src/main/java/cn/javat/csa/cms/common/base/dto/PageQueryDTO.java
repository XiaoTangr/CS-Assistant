package cn.javat.csa.cms.common.base.dto;


import cn.javat.csa.cms.common.enums.SortField;
import cn.javat.csa.cms.common.enums.SortOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 分页参数
 */
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "分页参数")
public class PageQueryDTO {

    /**
     * 页码（从1开始，默认1）
     */
    @Schema(description = "页码(默认 1)")
    private Integer page = 1;
    
    /**
     * 每页条数（默认20）
     */
    @Schema(description = "条数(默认 20)")
    private Integer size = 20;
    
    /**
     * 搜索关键词（用于标题和内容的模糊匹配）
     */
    @Schema(description = "搜索词(标题和内容匹配)")
    private String keyword;
    
    /**
     * 排序字段（createTime-按创建时间, updateTime-按更新时间, default-默认排序）
     */
    @Schema(description = "排序字段(createTime/updateTime/default,默认 default)")
    private String sort = "default";
    
    /**
     * 排序顺序（asc-升序, desc-降序，默认desc）
     */
    @Schema(description = "排序顺序:asc/desc(默认 desc)")
    private String sortOrder = "desc";
    
    /**
     * 获取排序字段枚举(自动转换)
     */
    public SortField getSortField() {
        return SortField.fromValue(this.sort);
    }
    
    /**
     * 获取排序顺序枚举(自动转换)
     */
    public SortOrder getSortOrderEnum() {
        return SortOrder.fromValue(this.sortOrder);
    }
}
