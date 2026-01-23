<template>
    <GlassButtonGroup id="WindowMover" size="large" style="-webkit-app-region: drag">
        <el-tooltip content="移动窗口">
            <GlassButton round :icon="Rank" />
        </el-tooltip>
    </GlassButtonGroup>
</template>


<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue';
</script>

<style scoped></style>
