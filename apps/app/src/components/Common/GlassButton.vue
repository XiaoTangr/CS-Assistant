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

    /* 基础颜色变量 */
    --el-color-primary: #40a0ff88;
    --el-color-success: #67c23a88;
    --el-color-warning: #e6a23c88;
    --el-color-danger: #f56c6c88;
    --el-color-info: #90939988;

    --el-fill-color-light: #f5f7fa66;
    --el-fill-color-blank: #f5f7fa66;
    /* Primary 浅色/深色 */
    --el-color-primary-light-3: #79BBFF66;
    --el-color-primary-light-5: #A0CFFF66;
    --el-color-primary-light-7: #C6E2FF66;
    --el-color-primary-light-9: #ECF5FF66;
    --el-color-primary-dark-2: #337dcc90;

    /* Success 浅色/深色 */
    --el-color-success-light-3: #85CE6166;
    --el-color-success-light-5: #A4DA8966;
    --el-color-success-light-7: #C2E7B066;
    --el-color-success-light-9: #E1F3D866;
    --el-color-success-dark-2: #529B2E90;

    /* Warning 浅色/深色 */
    --el-color-warning-light-3: #EBB56366;
    --el-color-warning-light-5: #F0C78A66;
    --el-color-warning-light-7: #F5DAB166;
    --el-color-warning-light-9: #FAECD866;
    --el-color-warning-dark-2: #B8823090;

    /* Danger 浅色/深色 */
    --el-color-danger-light-3: #F7898966;
    --el-color-danger-light-5: #F9A7A766;
    --el-color-danger-light-7: #FBC4C466;
    --el-color-danger-light-9: #FDE2E266;
    --el-color-danger-dark-2: #C4565690;

    /* Info 浅色/深色 */
    --el-color-info-light-3: #A6A9AD66;
    --el-color-info-light-5: #BBBFC466;
    --el-color-info-light-7: #D3D4D666;
    --el-color-info-light-9: #E9E9EB66;
    --el-color-info-dark-2: #73767A90;

}

.GlassButton.el-button {
    box-shadow:
        0 .2em .8em rgba(0, 0, 0, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button:hover {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button.is-shadow-always {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button.is-shadow-always:hover {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button.is-shadow-hover {
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button.is-shadow-hover:hover {
    box-shadow:
        0 .2em .8em rgba(31, 38, 135, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button.is-shadow-never {
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6);
}

.GlassButton.el-button.is-shadow-never:hover {
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6);
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
    backdrop-filter: none ;
    -webkit-backdrop-filter: none ;
    box-shadow: none !important;
    border: none ;
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
</style>
