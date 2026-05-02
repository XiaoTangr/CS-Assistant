package cn.javat.csa.cms.modules.sys.rbac.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Set;

/**
 * 认证信息视图对象
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Schema(description = "认证信息")
public class AuthVO {

    /**
     * 菜单树列表（用于前端渲染导航菜单）
     */
    @Schema(description = "菜单树列表")
    private List<MenuTreeVO> menuList;

    /**
     * 权限标识集合（用于前端按钮级权限控制）
     */
    @Schema(description = "权限标识集合")
    private Set<String> permissionCodes;
}