<template>
    <div class="status-bar">
        状态栏,不知道放什么
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.status-bar {
    display: flex;
    align-items: center;
    height: $status-bar-height;
    border: $simple-border;
    border-radius: $globe-border-radius;
    padding: 0 $globe-padding;
    backdrop-filter: $globe-backdrop-filter;
    font-size: $font-size;
}
</style>