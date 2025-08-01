<template>
    <el-space class="space-container" :size="size" :direction="direction" :spacer="spacer" :alignment="alignment"
        :fill="fill" :fill-ratio="fillRatio" :wrap="wrap">
        <slot />
    </el-space>
</template>

<script setup lang="ts">
import { VNode } from 'vue';
interface SpaceProps {
    size?: number;
    direction?: "horizontal" | "vertical";
    spacer?: VNode | string;
    alignment?: "start" | "end" | "center" | "baseline";
    fill?: boolean;
    fillRatio?: number;
    wrap?: boolean;
}
withDefaults(defineProps<SpaceProps>(), {
    size: 14,
    direction: "horizontal",
    spacer: "",
    alignment: "start",
    fill: false,
    fillRatio: 1,
    wrap: false
});

</script>

<style scoped lang="scss"></style>
