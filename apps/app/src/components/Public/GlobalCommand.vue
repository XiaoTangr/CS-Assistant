<template>
    <CommSpace direction="horizontal">
        <LiquidButtonGroup size="large">
            <el-tooltip content="后退">
                <LiquidButton @click="back" round :icon="ArrowLeftBold" />
            </el-tooltip>
            <el-tooltip content="前进">
                <LiquidButton @click="next" round :icon="ArrowRightBold" />
            </el-tooltip>
        </LiquidButtonGroup>
        <LiquidButtonGroup size="large" style="-webkit-app-region: drag">
            <el-tooltip content="移动窗口">
                <LiquidButton round :icon="Rank" />
            </el-tooltip>
        </LiquidButtonGroup>
        <CommSpace class="right" direction="horizontal">
            <LiquidButtonGroup size="large">
                <el-tooltip content="回到顶部">
                    <LiquidButton round @click="backUp" :icon="Top" />
                </el-tooltip>
            </LiquidButtonGroup>
        </CommSpace>
    </CommSpace>

</template>

<script setup lang="ts">
import { ArrowLeftBold, ArrowRightBold, Rank, Top } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import LiquidButtonGroup from '../Common/LiquidButtonGroup.vue';
import LiquidButton from '../Common/LiquidButton.vue';
import CommSpace from '../Common/CommSpace.vue';

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
        console.error('Element with class .window-container not found');
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