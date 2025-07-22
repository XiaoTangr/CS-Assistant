<template>
    <div class="liquid-card">
        <slot />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* 卡片容器 */
.liquid-card {
    /* background: rgba(255, 255, 255, 0.2); */
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow:
        0 8px 32px rgba(31, 38, 135, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}
</style>