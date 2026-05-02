<template>
    <el-space class="space-container" :size="setSize" :direction="direction" :spacer="spacer" :alignment="alignment"
        :fill="fill" :fill-ratio="fillRatio" :wrap="wrap">
        <slot />
    </el-space>
</template>

<script setup lang="ts">
import { onMounted, VNode } from 'vue';

import scssvar from '@/css/variables.module.scss'
import { ref } from 'vue';
import { remToPx } from '@/core/utils';

interface SpaceProps {
    size?: number;
    direction?: "horizontal" | "vertical";
    spacer?: VNode | string;
    alignment?: "start" | "end" | "center" | "baseline";
    fill?: boolean;
    fillRatio?: number;
    wrap?: boolean;
}
const props = withDefaults(defineProps<SpaceProps>(), {
    size: undefined,
    direction: "horizontal",
    spacer: "",
    alignment: "start",
    fill: false,
    fillRatio: 1,
    wrap: false
});

const setSize = ref(0);

onMounted(() => {
    if (!props.size) {
        setSize.value = remToPx(scssvar.globePadding) as number;
    } else {
        setSize.value = props.size;
    }
})
</script>

<style scoped lang="scss"></style>
