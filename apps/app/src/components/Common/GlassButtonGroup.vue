<template>
    <el-button-group :size="size" :type="type" >
        <slot></slot>
    </el-button-group>
</template>

<script setup lang="ts">
defineProps<{
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'large' | 'default' | 'small';
}>();
</script>

<style scoped lang="scss">
.liquid-button-group {
    // border-radius: 100vw;
    // overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow:
        0 8px 32px rgba(31, 38, 135, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}
</style>