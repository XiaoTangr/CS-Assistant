<template>
    <div>
        <el-menu mode="vertical" :router="true" :default-active="activeMenu">
            <menu-item :menu-list="navData" />
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MenuItem from './MenuItem.vue';

const router = useRouter()
const route = useRoute()

const navData = computed(() => {
    const targetRoute = router.getRoutes().find(item => item.path === '/dashboard')
    return targetRoute?.children || []
})

// 计算当前应该激活的菜单项
const activeMenu = computed(() => {
    // 返回当前路由的路径
    return route.path
})
</script>

<style scoped></style>