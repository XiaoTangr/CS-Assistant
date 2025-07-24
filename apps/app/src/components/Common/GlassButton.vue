<template>
    <el-button class="btn " :class="'btn-' + type" :type="type" :size="size" :disabled="disabled" :loading="loading"
        :native-type="nativeType" :autofocus="autofocus" :round="round" :plain="plain" :circle="circle"
        :style="customStyle" @click="$emit('click')">
        <!-- 显式渲染图标 -->
        <el-icon v-if="icon">
            <component :is="icon" />
        </el-icon>

        <!-- 插槽内容 -->
        <slot v-if="$slots.default"></slot>
    </el-button>
</template>

<script setup lang="ts">
defineProps<{
    type?: string;
    size?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: any; // 接收图标的组件或名称
    nativeType?: string;
    autofocus?: boolean;
    round?: boolean;
    plain?: boolean;
    circle?: boolean;
    customStyle?: Record<string, string>;
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>

<style scoped lang="scss">
.btn {
    background: rgba(255, 255, 255, 0.4) !important;
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%) !important;
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.06),
        inset 0 1px 2px rgba(255, 255, 255, 0.6) !important;
    color: rgba(48, 49, 51, .88) !important;
}

.btn:hover {
    color: rgba(48, 49, 51, 1) !important;
    background: rgba(48, 49, 51, 0.05) !important;
}

.btn-primary {
    background: rgba(64, 160, 255, 0.1) !important;
    // color: #ffffff !important;
}

.btn-primary:hover {
    background: rgba(64, 160, 255, 0.3) !important;
    // color: #ffffff !important;
}

.btn-success {
    background: rgba(76, 175, 80, 0.1) !important;
}

.btn-success:hover {
    background: rgba(76, 175, 80, 0.3) !important;
}

.btn-warning {
    background: rgba(255, 193, 7, 0.1) !important;
}

.btn-warning:hover {
    background: rgba(255, 193, 7, 0.3) !important;
}

.btn-danger {
    background: rgba(244, 67, 54, 0.1) !important;
}

.btn-danger:hover {
    background: rgba(244, 67, 54, 0.3) !important;
}
</style>