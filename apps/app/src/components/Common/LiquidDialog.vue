<template>
    <el-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :title="title"
        :width="width" :fullscreen="fullscreen" :top="top" :modal="modal" :modal-class="modalClass"
        :header-class-name="headerClass" :body-class-name="bodyClass" :footer-class-name="footerClass"
        :append-to-body="appendToBody" :append-to="appendTo" :lock-scroll="lockScroll" :open-delay="openDelay"
        :close-delay="closeDelay" :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape"
        :show-close="showClose" :before-close="beforeClose" :draggable="draggable" :overflow="overflow" :center="center"
        :align-center="alignCenter" :destroy-on-close="destroyOnClose" :close-icon="closeIcon" :z-index="zIndex"
        :header-aria-level="headerAriaLevel" :class="customClass" @opened="$emit('opened')" @close="$emit('close')"
        @closed="$emit('closed')" @open-auto-focus="$emit('open-auto-focus')"
        @close-auto-focus="$emit('close-auto-focus')">
        <!-- 使用插槽 -->
        <template #header>
            <slot name="header">
                <!-- 默认标题 -->
                <span class="el-dialog__title">{{ title }}</span>
            </slot>
        </template>

        <!-- 默认内容插槽 -->
        <slot />

        <!-- 底部插槽 -->
        <template #footer>
            <slot name="footer" />
        </template>

    </el-dialog>
</template>
<script setup lang="ts">
import { Component } from 'vue'


interface LiquidDialogProps {
    modelValue?: boolean
    title?: string
    width?: string | number
    fullscreen?: boolean
    top?: string
    modal?: boolean
    modalClass?: string
    headerClass?: string
    bodyClass?: string
    footerClass?: string
    appendToBody?: boolean
    appendTo?: string | HTMLElement
    lockScroll?: boolean
    openDelay?: number
    closeDelay?: number
    closeOnClickModal?: boolean
    closeOnPressEscape?: boolean
    showClose?: boolean
    beforeClose?: (done: () => void) => void
    draggable?: boolean
    overflow?: boolean
    center?: boolean
    alignCenter?: boolean
    destroyOnClose?: boolean
    closeIcon?: string | Component
    zIndex?: number
    headerAriaLevel?: string
    customClass?: string
}

withDefaults(defineProps<LiquidDialogProps>(), {
    modelValue: false,
    title: '',
    width: '50%',
    fullscreen: false,
    top: '15vh',
    modal: true,
    modalClass: 'liquid-dialog-modal',
    headerClass: undefined,
    bodyClass: undefined,
    footerClass: undefined,
    appendToBody: false,
    appendTo: 'body',
    lockScroll: true,
    openDelay: 0,
    closeDelay: 0,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showClose: true,
    beforeClose: undefined,
    draggable: false,
    overflow: false,
    center: false,
    alignCenter: false,
    destroyOnClose: false,
    closeIcon: undefined,
    zIndex: undefined,
    headerAriaLevel: '2',
    customClass: "liquid-dialog"
})



// 定义支持的事件
defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'open'): void
    (e: 'opened'): void
    (e: 'close'): void
    (e: 'closed'): void
    (e: 'open-auto-focus'): void
    (e: 'close-auto-focus'): void
}>()
</script>
<style lang="scss">
/* 卡片容器 */
.liquid-dialog {
    background: rgba(250, 250, 250, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow:
        0 8px 32px rgba(31, 38, 135, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
    border-radius: 1em !important;
}

.liquid-dialog-modal {
    background: rgba(250, 250, 250, 0.1) !important;
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
}
</style>