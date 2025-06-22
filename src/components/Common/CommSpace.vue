<template>
    <el-space class="space-container" :size="size" :direction="direction" :spacer="spacer" :alignment="alignment"
        :fill="fill" :fill-ratio="fillRatio">
        <slot />
    </el-space>
</template>

<script setup lang="ts">
import { VNode } from 'vue';

defineProps({
    size: {
        type: Number,
        default: 14
    },
    direction: {
        type: String as () => "horizontal" | "vertical",
        default: "vertical"
    },
    alignment: {
        type: String as () => "start" | "center" | "end",
        default: "start"
    },
    spacer: {
        type: String as () => String | Number | VNode,
        default: ""
    },
    wrap: {
        type: Boolean,
        default: false
    },
    fill: {
        type: Boolean,
        default: true
    }
    , fillRatio: {
        type: Number,
        default: 0
    }

});
</script>

<style scoped lang="scss">
.space-container {}
</style>