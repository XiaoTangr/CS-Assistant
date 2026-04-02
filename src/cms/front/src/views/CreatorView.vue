<template>
    <div class="container">
        <div class="header">
            <el-page-header :title="'登出'" @back="logoutHandler">
                <template #content>
                    创作者管理面板
                </template>
                <template #extra>
                    欢迎用户: {{ currentSysUser?.username }}
                </template>
            </el-page-header>
        </div>
        <div class="inner-container">
            <el-tabs style="height: 100%;" tabPosition="left" v-model="activeName">
                <el-tab-pane class="panel" label="个人信息" name="profile">
                    <current-profile></current-profile>
                </el-tab-pane>
                <el-tab-pane class="panel" label="发布管理" name="post">
                    <biz-post-creator />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import CurrentProfile from '@/components/CurrentProfile.vue';
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { storeToRefs } from 'pinia';
import { ElNotification } from 'element-plus';
const activeName = ref('profile')
const router = useRouter()
const currentUserStore = useCurrentUserStore()

const { currentSysUser } = storeToRefs(currentUserStore);

const logoutHandler = () => {
    currentUserStore.logout();
    ElNotification.info({
        title: '提示',
        message: '已退出登录',
        duration: 2000,
    });
    router.push('/')
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    height: 100vh;

    .header {
        z-index: 99;
        position: sticky;
        top: 0;
        backdrop-filter: blur(1rem);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.5);
        padding: 1rem;
        width: 100%;
    }

    .inner-container {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 1rem;
        padding-top: 0;
    }

    .panel {
        overflow-y: auto;
    }
}
</style>
<style>
/* .el-tabs--card {
    height: calc(100vh - 110px);
    overflow-y: auto; 
}*/

.el-tab-pane {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow-y: auto;
}
</style>