<template>
    <el-button class="GlassButton"
        :class="{ 'is-shadow-hover': shadow == 'hover', 'is-shadow-never': shadow == 'never' }" :text="text"
        :type="type" :size="size" :disabled="disabled" :loading="loading" :native-type="nativeType"
        :autofocus="autofocus" :round="round" :plain="plain" :circle="circle" :style="customStyle" :bg="bg" :link="link"
        @click="$emit('click')">
        <!-- 显式渲染图标 -->
        <el-icon v-if="icon">
            <component :is="icon" />
        </el-icon>

        <!-- 插槽内容 -->
        <div class="btn-def">
            <slot v-if="$slots.default"></slot>
        </div>

    </el-button>
</template>

<script setup lang="ts">

withDefaults(
    defineProps<{
        type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | '';
        size?: 'large' | 'default' | 'small';
        disabled?: boolean;
        loading?: boolean;
        icon?: any; // 接收图标的组件或名称
        nativeType?: 'button' | 'submit' | 'reset';
        autofocus?: boolean;
        round?: boolean;
        plain?: boolean;
        circle?: boolean;
        customStyle?: Record<string, string>;
        text?: boolean;
        bg?: boolean;
        link?: boolean;
        shadow?: 'always' | 'never' | 'hover';
    }>(), {
    type: 'default',
    size: undefined,
    disabled: undefined,
    loading: undefined,
    icon: undefined, // 接收图标的组件或名称
    nativeType: 'button',
    autofocus: undefined,
    round: undefined,
    plain: undefined,
    circle: undefined,
    customStyle: undefined,
    text: undefined,
    bg: undefined,
    link: undefined,
    shadow: 'always',
})




defineEmits<{
    (e: 'click'): void;
}>();
</script>

<style scoped lang="scss">
.btn-def {
    display: flex;
    align-items: center;
    justify-content: center;
}



.GlassButton.el-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);

    --el-fill-color-light: #f5f7fa80;
    --el-fill-color-blank: #f5f7fa80;

    --el-color-primary: #40a0ff80;
    --el-color-primary-light-3: #79bbff80;
    --el-color-primary-light-5: #a0cfff80;
    --el-color-primary-light-7: #c6e2ff80;
    --el-color-primary-light-8: #d9ecff80;
    --el-color-primary-light-9: #ecf5ff80;
    --el-color-primary-dark-2: #337ecc80;
    --el-color-success: #67c23a80;
    --el-color-success-light-3: #95d47580;
    --el-color-success-light-5: #b3e19d80;
    --el-color-success-light-7: #d1edc480;
    --el-color-success-light-8: #e1f3d880;
    --el-color-success-light-9: #f0f9eb80;
    --el-color-success-dark-2: #529b2e80;
    --el-color-warning: #e6a23c80;
    --el-color-warning-light-3: #eebe7780;
    --el-color-warning-light-5: #f3d19e80;
    --el-color-warning-light-7: #f8e3c805;
    --el-color-warning-light-8: #faecd880;
    --el-color-warning-light-9: #fdf6ec80;
    --el-color-warning-dark-2: #b8823080;
    --el-color-danger: #f56c6c80;
    --el-color-danger-light-3: #f8989880;
    --el-color-danger-light-5: #fab6b680;
    --el-color-danger-light-7: #fcd3d380;
    --el-color-danger-light-8: #fde2e280;
    --el-color-danger-light-9: #fef0f080;
    --el-color-danger-dark-2: #c4565680;
    --el-color-error: #f56c6c80;
    --el-color-error-light-3: #f8989880;
    --el-color-error-light-5: #fab6b680;
    --el-color-error-light-7: #fcd3d380;
    --el-color-error-light-8: #fde2e280;
    --el-color-error-light-9: #fef0f080;
    --el-color-error-dark-2: #c4565680;
    --el-color-info: #90939980;
    --el-color-info-light-3: #b1b3b880;
    --el-color-info-light-5: #c8c9cc80;
    --el-color-info-light-7: #dedfe080;
    --el-color-info-light-8: #e9e9eb80;
    --el-color-info-light-9: #f4f4f805;
    --el-color-info-dark-2: #73767a80;
}

.GlassButton.el-button {
    box-shadow:
        0 .2em .8em rgba(0, 0, 0, 0.08),
        inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button:hover {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button.is-shadow-always {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button.is-shadow-always:hover {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button.is-shadow-hover {
    box-shadow: inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button.is-shadow-hover:hover {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button.is-shadow-never {
    box-shadow: inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

.GlassButton.el-button.is-shadow-never:hover {
    box-shadow: inset 0 1px 2px rgba(280, 280, 280, 0.6);
}

// default 按钮的样式
.GlassButton.el-button:not(.el-button--primary):not(.el-button--success):not(.el-button--warning):not(.el-button--danger):not(.el-button--info) {
    --el-button-text-color: var(--el-text-color-regular);
    --el-button-hover-text-color: var(--el-text-color-primary);
    --el-button-hover-bg-color: var(--el-color-primary-light-9);
    --el-button-hover-border-color: var(--el-color-primary-light-5);
}


.GlassButton.is-text,
.GlassButton.is-link {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none !important;
    border: none;
}


// 文本，链接，朴素按钮使用不透明颜色
.GlassButton.el-button.is-text,
.GlassButton.el-button.is-link,
.GlassButton.el-button.is-plain {
    --el-fill-color-light: #f5f7faaa;
    --el-color-primary: #40a0ff;
    --el-color-success: #67c23a;
    --el-color-warning: #e6a23c;
    --el-color-danger: #f56c6c;
    --el-color-info: #909399;
}

.GlassButton.el-button--primary.is-plain {
    --el-button-hover-text-color: var(--el-color-primary);
    --el-button-hover-bg-color: var(--el-color-primary-light-7);
}

.GlassButton.el-button--success.is-plain {
    --el-button-hover-text-color: var(--el-color-success);
    --el-button-hover-bg-color: var(--el-color-success-light-7);
}

.GlassButton.el-button--warning.is-plain {
    --el-button-hover-text-color: var(--el-color-warning);
    --el-button-hover-bg-color: var(--el-color-warning-light-7);
}

.GlassButton.el-button--danger.is-plain {
    --el-button-hover-text-color: var(--el-color-danger);
    --el-button-hover-bg-color: var(--el-color-danger-light-7);
}

.GlassButton.el-button--info.is-plain {
    --el-button-hover-text-color: var(--el-color-info);
    --el-button-hover-bg-color: var(--el-color-info-light-7);
}


.GlassButton.el-button.is-link {
    --el-color-primary-light-5: var(--el-color-primary-dark-2);
    --el-color-success-light-5: var(--el-color-success-dark-2);
    --el-color-warning-light-5: var(--el-color-warning-dark-2);
    --el-color-danger-light-5: var(--el-color-danger-dark-2);
    --el-color-info-light-5: var(--el-color-info-dark-2);
}
</style>
