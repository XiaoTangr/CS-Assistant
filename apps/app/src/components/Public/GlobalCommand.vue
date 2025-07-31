<template>
    <CommSpace direction="horizontal">
        <GlassButtonGroup size="large">
            <el-tooltip content="后退">
                <GlassButton @click="back" round :icon="ArrowLeftBold" />
            </el-tooltip>
            <el-tooltip content="前进">
                <GlassButton @click="next" round :icon="ArrowRightBold" />
            </el-tooltip>
        </GlassButtonGroup>
        <GlassButtonGroup size="large" style="-webkit-app-region: drag">
            <el-tooltip content="移动窗口">
                <GlassButton round :icon="Rank" />
            </el-tooltip>
        </GlassButtonGroup>
        <CommSpace class="right" direction="horizontal">
            <GlassButtonGroup size="large">
                <el-tooltip content="回到顶部">
                    <GlassButton round @click="backUp" :icon="Top" />
                </el-tooltip>
            </GlassButtonGroup>
        </CommSpace>
    </CommSpace>

</template>

<script setup lang="ts">
import { ArrowLeftBold, ArrowRightBold, Rank, Top } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import GlassButtonGroup from '../Common/GlassButtonGroup.vue';
import GlassButton from '../Common/GlassButton.vue';
import CommSpace from '../Common/CommSpace.vue';
import { LogServices } from '@/core/services';

const router = useRouter();
const back = () => {
    router.back();
}
const next = () => {
    router.forward();
}
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

<style scoped lang="scss">
.right {
    position: absolute;
    top: 1em;
    right: 1em;
}
</style>