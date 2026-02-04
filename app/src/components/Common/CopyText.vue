<template>
    <span @click="handleCopy" class="copy-container" ref="containerRef">
        <span class="content-wrapper" :style="contentStyle">
            <span v-if="prefix" class="prefix">{{ prefix }}</span>
            <slot>
                <el-tooltip :show-after="100" :hide-after="0" :offset="4" :content="tooltipContent">
                    <span class="text-content" :style="textStyle">{{ displayValue }}</span>
                </el-tooltip>
            </slot>
            <span v-if="suffix" class="suffix">{{ suffix }}</span>
        </span>
    </span>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { ref, computed } from 'vue'

interface Props {
    /** 双向绑定的值，使用 v-model */
    modelValue?: unknown
    /** 单向绑定的值，使用 :value */
    value?: unknown
    /** 前缀内容（不包含在复制文本中） */
    prefix?: string
    /** 后缀内容（不包含在复制文本中） */
    suffix?: string
    /** 行数限制，超过该行数显示省略号 */
    lineClamp?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    prefix: '',
    suffix: '',
    lineClamp: undefined
})

const emit = defineEmits(['update:modelValue'])

const containerRef = ref<HTMLElement | null>(null)

// 计算显示的最终值（优先使用 modelValue，其次 value）
const displayValue = computed(() => props.modelValue || props.value)

// 计算内容样式
const contentStyle = computed(() => {
    if (props.lineClamp !== undefined) {
        return {
            display: '-webkit-box',
            '-webkit-line-clamp': props.lineClamp as number,
            '-webkit-box-orient': 'vertical' as const,
            'overflow': 'hidden'
        }
    }
    return {}
})

// 计算文本样式
const textStyle = computed(() => {
    if (props.lineClamp !== undefined) {
        return {
            display: 'block',
            'white-space': 'normal'
        }
    }
    return {}
})

// 计算 tooltip 内容
const tooltipContent = computed(() => {
    if (props.lineClamp !== undefined) {
        return `单击复制到剪切板: ${props.prefix}${displayValue.value}${props.suffix}`;
    }
    return '单击复制到剪切板';
})

/**
 * 获取纯净的文本内容（不含前后缀）
 */
const getPureContent = (): string => {
    // 优先使用绑定的值
    if (displayValue.value) return (displayValue.value).toString().trim()

    // 从 slot 获取内容并去除前后缀
    if (containerRef.value) {
        const fullText = containerRef.value.textContent || ''
        return fullText
            .replace(new RegExp(`^${props.prefix}`), '')
            .replace(new RegExp(`${props.suffix}$`), '')
            .trim()
    }

    return ''
}

/**
 * 处理复制操作
 */
const handleCopy = async () => {
    try {
        const pureContent = getPureContent()

        if (!pureContent) {
            ElNotification.warning('复制失败: 文本内容为空')
            return
        }

        await navigator.clipboard.writeText(pureContent)
        ElNotification.success(`复制成功: ${pureContent}`)

        // 如果是 v-model 绑定的，触发更新事件
        if (props.modelValue !== undefined) {
            emit('update:modelValue', pureContent)
        }
    } catch (error) {
        ElNotification.error('复制失败')
        console.error('复制操作失败:', error)
    }
}
</script>
<style lang="scss" scoped>
.copy-container {
    cursor: pointer;
    width: 100%;
}

.content-wrapper {
    width: 100%;
    word-break: break-all;
}

// .prefix,
// .suffix {
//     opacity: 0.7;
//     flex-shrink: 0;
// }

.text-content {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
