<template>
    <template v-for="item in filteredMenuList" :key="item.path">
        <!-- 有子菜单的分组 -->
        <el-sub-menu v-if="item.children && item.children.length > 0" :index="getMenuIndex(item)">
            <template #title>
                <el-icon v-if="getIconComponent(item.meta?.icon)">
                    <component :is="getIconComponent(item.meta?.icon)" />
                </el-icon>
                <span>{{ item.meta?.title }}</span>
            </template>
            <MenuItem :menu-list="item.children" />
        </el-sub-menu>

        <!-- 无子菜单的普通菜单项 -->
        <el-menu-item v-else :index="getMenuIndex(item)" @click="handleMenuClick(item)">
            <el-icon v-if="getIconComponent(item.meta?.icon)">
                <component :is="getIconComponent(item.meta?.icon)" />
            </el-icon>
            <template #title>{{ item.meta?.title }}</template>
        </el-menu-item>
    </template>
</template>

<script setup lang="ts">
import { type RouteRecordRaw, useRouter } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { storeToRefs } from 'pinia'
import { computed, type Component } from 'vue'

const currentUserStore = useCurrentUserStore()
const { isLogined, userRole } = storeToRefs(currentUserStore)
const router = useRouter()

const props = defineProps<{
    menuList: RouteRecordRaw[]
}>()

/**
 * 获取菜单项的 index
 * 如果路径包含动态参数（如 :id），则移除参数部分
 * @param route 路由记录
 * @returns 菜单索引
 */
const getMenuIndex = (route: RouteRecordRaw): string => {
    if (!route.path) return ''
    
    // 移除动态参数部分，例如 /posteidtor/:id? -> /posteidtor
    return route.path.replace(/\/:[^/?]+(\??)/g, '')
}

/**
 * 处理菜单点击事件
 * 对于动态路由，需要特殊处理
 * @param route 路由记录
 */
const handleMenuClick = (route: RouteRecordRaw) => {
    // 如果路径包含动态参数，导航到基础路径
    const cleanPath = getMenuIndex(route)
    if (cleanPath !== route.path) {
        // 动态路由，导航到基础路径（不带参数）
        router.push(cleanPath).catch(err => {
            console.warn('导航失败:', err)
        })
    }
    // 否则让 el-menu 默认处理
}

/**
 * 检查路由是否有访问权限
 * @param route 路由记录
 * @returns 是否有权限访问
 */
const hasPermission = (route: RouteRecordRaw): boolean => {
    // 如果不需要认证，直接允许访问
    if (!route.meta?.requiresAuth) {
        return true
    }

    // 需要认证但未登录，拒绝访问
    if (!isLogined.value) {
        return false
    }

    // 检查角色权限
    const requiredRole = route.meta?.requiresRole
    if (requiredRole !== undefined) {
        // 用户角色必须大于等于所需角色才能访问
        return (userRole.value ?? 0) >= requiredRole
    }

    // 没有角色限制，允许访问
    return true
}

/**
 * 过滤菜单列表，只保留有权限访问的菜单项
 */
const filteredMenuList = computed(() => {
    const filterRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
        return routes.filter(route => {
            // 首先检查当前菜单项是否有权限
            if (!hasPermission(route)) {
                return false
            }

            // 如果有子菜单，递归过滤子菜单
            if (route.children && route.children.length > 0) {
                const filteredChildren = filterRoutes(route.children)

                // 创建新的路由对象，避免修改原始路由配置
                return {
                    ...route,
                    children: filteredChildren
                } as RouteRecordRaw
            }

            return true
        })
    }

    return filterRoutes(props.menuList)
})

/**
 * 将图标字符串转换为 Element Plus 图标组件
 * @param iconName 图标名称
 * @returns 图标组件或 null
 */
const getIconComponent = (iconName?: string): Component | null => {
    if (!iconName || typeof iconName !== 'string') {
        return null
    }

    // 检查是否是 Element Plus 图标
    if (iconName in ElementPlusIconsVue) {
        return ElementPlusIconsVue[iconName as keyof typeof ElementPlusIconsVue] as Component
    }

    // 不是有效的图标名称，返回 null
    return null
}
</script>

<style scoped lang="scss"></style>