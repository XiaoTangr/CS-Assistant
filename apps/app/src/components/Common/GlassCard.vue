<template>
    <el-card class="liquid-card" :header="header" :footer="footer" :body-style="bodyStyle" :header-class="headerClass"
        :body-class="bodyClass" :footer-class="footerClass" :shadow="shadow">
        <template #header v-if="$slots.header || header">
            <slot name="header">
                {{ header }}
            </slot>
        </template>

        <slot />

        <template #footer v-if="$slots.footer || footer">
            <slot name="footer">
                {{ footer }}
            </slot>
        </template>
    </el-card>
</template>

<script setup lang="ts">
interface GlassCardProps {
    header?: string
    footer?: string
    bodyStyle?: Partial<CSSStyleDeclaration>
    headerClass?: string
    bodyClass?: string
    footerClass?: string
    shadow?: 'always' | 'hover' | 'never'
}

withDefaults(defineProps<GlassCardProps>(), {
    header: undefined,
    footer: undefined,
    bodyStyle: () => ({}),
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
}

.liquid-card.el-card.is-hover-shadow,
.liquid-card.el-card.is-never-shadow {
    box-shadow: none;
}

.liquid-card.el-card.is-hover-shadow:hover {
    box-shadow: 0px 0px 32px rgba(31, 38, 135, 0.12),
        inset 0 1px 2px rgba(255, 255, 255, 0.6) !important;
}
</style>