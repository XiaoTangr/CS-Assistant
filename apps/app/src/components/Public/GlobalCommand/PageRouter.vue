<template>
    <GlassButtonGroup size="large">
        <el-tooltip content="后退">
            <GlassButton @click="back" round :icon="ArrowLeftBold" />
        </el-tooltip>
        <el-tooltip content="前进">
            <GlassButton @click="next" round :icon="ArrowRightBold" />
        </el-tooltip>
    </GlassButtonGroup>
</template>


<script setup lang="ts">
import GlassButton from '@/components/Common/GlassButton.vue';
import GlassButtonGroup from '@/components/Common/GlassButtonGroup.vue';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const back = () => {
    router.back();
}
const next = () => {
    router.forward();
}
</script>

<style scoped></style>
