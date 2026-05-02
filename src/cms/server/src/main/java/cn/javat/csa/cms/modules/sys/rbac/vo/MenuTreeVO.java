package cn.javat.csa.cms.modules.sys.rbac.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * 菜单树视图对象
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Schema(description = "菜单树节点")
public class MenuTreeVO {

    /**
     * 菜单ID
     */
    @Schema(description = "菜单ID", example = "1")
    private Long id;

    /**
     * 菜单名称（显示文本）
     */
    @Schema(description = "菜单名称", example = "系统管理")
    private String menuName;

    /**
     * 路由路径（前端路由地址）
     */
    @Schema(description = "路由路径", example = "/system")
    private String path;

    /**
     * 组件路径（Vue组件文件路径）
     */
    @Schema(description = "组件路径", example = "views/system/index")
    private String component;

    /**
     * 子菜单列表（递归结构）
     */
    @Schema(description = "子菜单列表")
    private List<MenuTreeVO> children;
}