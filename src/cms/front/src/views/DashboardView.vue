<template>
    <el-container class="main-container">
        <aside class="menu">
            <nav-menu />
        </aside>
        <el-main class="main">
            <router-view />
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import NavMenu from '@/components/dashboard/nav/NavMenu.vue';

</script>

<style scoped lang="scss">
.main-container {
    position: absolute;
    top: 4rem;
    left: 0;
    bottom: 0;
    width: 100vw;
    overflow: hidden;
    gap: 1rem;
    padding: 1rem;

    .menu {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }

    .main {
        padding: 0;
        height: 100%;
        overflow: hidden; // 防止双重滚动条
    }
}
</style>