<template>
    <div>
        <!-- 用于渲染设置项目 -->
        {{ config }}
    </div>
</template>

<script setup lang="ts">
import { ConfigItem } from '@/core/types/settings';

// 获取属性
interface PropsDef {
    config: ConfigItem;
    highlight?: boolean;
}
const props = withDefaults(defineProps<PropsDef>(), { config: undefined });

</script>

<style scoped lang="scss"></style>