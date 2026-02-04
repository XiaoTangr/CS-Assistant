<template>
    <el-icon v-if="iconComponent">
        <component :is="iconComponent" />
    </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
    icon?: Component; // 接收 Element Plus 图标组件
}

const props = defineProps<Props>();

// 确保图标存在且为有效组件
const iconComponent = computed(() => {
    return props.icon || null;
});
</script>

<style lang="scss" scoped></style>
