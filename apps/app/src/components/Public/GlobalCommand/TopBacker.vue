<template>
    <GlassButtonGroup size="large">
        <el-tooltip content="回到顶部">
            <GlassButton round @click="backUp" :icon="Top" />
        </el-tooltip>
    </GlassButtonGroup>
</template>

<script setup lang="ts">
import GlassButton from '@/components/Common/GlassButton.vue';
import GlassButtonGroup from '@/components/Common/GlassButtonGroup.vue';
import { LogServices } from '@/core/services';
import { Top } from '@element-plus/icons-vue';
const backUp = () => {
    // 获取.window-container元素并设置滚动条为起始，使用平滑滚动动画
    const container = document.querySelector('.window-container');
    if (container) {
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        LogServices.error('Element with class .window-container not found');
    }
}
</script>

<style scoped></style>
