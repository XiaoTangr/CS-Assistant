<template>
    <el-card class="liquid-card" :header="header" :footer="footer" :body-style="bodyStyle" :header-class="headerClass"
        :body-class="bodyClass" :footer-class="footerClass" :shadow="shadow">
        <template #header v-if="$slots.header || header">
            <div class="liquid-card-header-content" :class="headerClass">
                <slot name="header">
                    {{ header }}
                </slot>
            </div>
        </template>

        <div class="liquid-card-body-content" :class="bodyClass">
            <slot />
        </div>

        <template #footer v-if="$slots.footer || footer">
            <div class="liquid-card-footer-content" :class="footerClass">
                <slot name="footer">
                    {{ footer }}
                </slot>
            </div>
        </template>
    </el-card>
</template>

<script setup lang="ts">
import { StyleValue } from 'vue'

interface GlassCardProps {
    header?: string
    footer?: string
    bodyStyle?: StyleValue[]
    headerClass?: string
    bodyClass?: string
    footerClass?: string
    shadow?: 'always' | 'hover' | 'never'
}

withDefaults(defineProps<GlassCardProps>(), {
    header: undefined,
    footer: undefined,
    bodyStyle: undefined,
    headerClass: undefined,
    bodyClass: undefined,
    footerClass: undefined,
    shadow: 'always'
})
</script>

<style lang="scss">
.liquid-card.el-card.is-always-shadow {
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow:
        0 8px 32px rgba(31, 38, 135, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.6) !important;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.liquid-card.el-card.is-hover-shadow,
.liquid-card.el-card.is-never-shadow {
    box-shadow: none;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.liquid-card.el-card.is-hover-shadow:hover {
    box-shadow: 0px 0px 32px rgba(31, 38, 135, 0.12),
        inset 0 1px 2px rgba(255, 255, 255, 0.6) !important;
}

.liquid-card .el-card__header,
.liquid-card .el-card__body,
.liquid-card .el-card__footer {
    width: 100%;
    padding: 18px 20px;
    flex-shrink: 0;
}

.liquid-card .el-card__body {
    flex: 1;
    padding: 20px;
}

.liquid-card-header-content,
.liquid-card-body-content,
.liquid-card-footer-content {
    width: 100%;
}
</style>
