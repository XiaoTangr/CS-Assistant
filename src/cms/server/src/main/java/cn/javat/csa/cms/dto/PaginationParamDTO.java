package cn.javat.csa.cms.dto;


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
public class PaginationParamDTO {

    @Schema(description = "页码(默认 1)")
    private Integer page = 1;
    
    @Schema(description = "条数(默认 20)")
    private Integer size = 20;
    
    @Schema(description = "搜索词(标题和内容匹配)")
    private String keyword;
    
    @Schema(description = "排序字段(createTime/updateTime/default,默认 default)")
    private String sort = "default";
    
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
