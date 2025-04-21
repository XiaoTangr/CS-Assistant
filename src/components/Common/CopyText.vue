<template>
    <p @click="copyToClipboard" class="copy-container" ref="copyContainer">
        <el-tooltip :show-after="100" :hide-after="0" placement="top-start" :offset="4" content="单击复制到剪切板">
            <slot>
                {{ text }}
            </slot>
        </el-tooltip>
    </p>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { ref, getCurrentInstance } from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: false,
    }
});

const copyContainer = ref<HTMLElement | null>(null);
const container = copyContainer.value;
const instance = getCurrentInstance();
const copyToClipboard = async () => {
    try {
        const slotContent = instance?.slots.default ? instance.slots.default()[0]?.el?.textContent || '' : '';
        const textToCopy = props.text?.toString() || slotContent || (container ? container.textContent : '');
        if (!textToCopy || textToCopy.length === 0) {
            ElNotification.warning('复制失败: 文本内容为空');
            return;
        }
        await navigator.clipboard.writeText(textToCopy);
        ElNotification.success(`复制成功: ${textToCopy}`);
    } catch (err) {
        console.error('复制失败', err);
    }
};
</script>

<style lang="scss">
.copy-container {
    display: inline-block;
    cursor: pointer;
}
</style>