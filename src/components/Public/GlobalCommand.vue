<template>
    <el-space class="container" :size="24">
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
    </el-space>

</template>

<script setup lang="ts">
import { ArrowLeftBold, ArrowRightBold, Rank } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import LiquidButtonGroup from '../Common/LiquidButtonGroup.vue';
import LiquidButton from '../Common/LiquidButton.vue';


const router = useRouter();
const back = () => {
    router.back();
}
const next = () => {
    router.forward();
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
}
</style>