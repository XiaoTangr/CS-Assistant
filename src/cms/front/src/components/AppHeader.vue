<template>
    <div class="header">
        <el-menu class="menu" persistent :default-active="activeIndex" mode="horizontal" :ellipsis="false"
            @select="handleSelect">
            <el-menu-item index="HOME">Home</el-menu-item>
            <el-sub-menu v-if="isLogined" index="logined">
                <template #title>
                    <el-avatar :size="32" :src="currentSysUser?.avatar" />
                    <el-text style="margin-left: 1rem">
                        {{ currentSysUser?.nickname || currentSysUser?.username }}
                    </el-text>
                </template>
                <template v-if="isLogined" #default>
                    <el-menu-item index="profile">个人中心</el-menu-item>
                    <el-menu-item v-if="dashboardAble" index="dashboard">管理中心</el-menu-item>
                    <el-menu-item index="logout">退出登录</el-menu-item>
                </template>
            </el-sub-menu>
            <el-sub-menu v-else index="notLogined">
                <template #title>登录</template>
                <template #default>
                    <el-menu-item index="login">登录</el-menu-item>
                    <el-menu-item index="register">注册</el-menu-item>
                </template>
            </el-sub-menu>
        </el-menu>
    </div>

</template>

<script setup lang="ts">
import { UserRole } from '@/enums/common';
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { ElMessage, ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router';

const currentSysUserStore = useCurrentUserStore()

const dashboardAble = computed(() => {
    return currentSysUser.value?.role === UserRole.ADMIN || currentSysUser.value?.role === UserRole.CREATOR
})

const router = useRouter()
const { currentSysUser, isLogined } = storeToRefs(currentSysUserStore)

onMounted(async () => {
    await currentSysUserStore.fetchData();
})

const activeIndex = ref('HOME')
const handleSelect = (key: string, keyPath: string[]) => {
    switch (keyPath[0]) {
        case 'HOME':
            router.push('/')
            break
        case 'logined':
            switch (key) {
                case 'profile':
                    router.push('/profile')
                    break
                case 'dashboard':
                    router.push('/dashboard')
                    break
                case 'logout':
                    currentSysUserStore.logout()
                    ElMessage.info('已退出登录')
                    // 刷新路由
                    router.go(0)
                    break
            }
            break
        case 'notLogined':
            switch (key) {
                case 'login':
                    router.push('/auth/login')
                    break
                case 'register':
                    router.push('/auth/register')
                    break
            }
            break
    }
}
</script>
<style scoped lang="scss">
.header {
    width: 100%;
    position: sticky;
    top: 0;


    .menu {
        background-color: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(1rem);

        .el-sub-menu:last-child {
            margin-right: 1rem;
        }

        .el-menu-item:nth-child(1) {
            margin-left: 1rem;
            margin-right: auto;
        }
    }
}
</style>