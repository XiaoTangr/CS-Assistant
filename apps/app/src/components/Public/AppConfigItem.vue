<template>
    <div class="container ">
        <div v-if="props.item.type === 'Boolean'" class="settings-item item-Boolean">
            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.title }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>

                <div class="item-options">
                    <el-switch v-model="props.item.value" :active-text="(props.item.options as BooleanOptions).true"
                        :inactive-text="(props.item.options as BooleanOptions).false" />
                </div>
            </div>
        </div>
        <div v-if="props.item.type === 'Select'" class="settings-item item-Select">

            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.title }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>

                <div class="item-options">
                    <el-select v-model="props.item.value" placeholder="Select" style="width: 100%">
                        <el-option v-for="(i) in props.item.options as SelectOption[]" :key="i.value" :label="i.label"
                            :value="i.value" />
                    </el-select>
                </div>
            </div>
        </div>
        <div v-if="props.item.type === 'Input'" class="settings-item item-Input">
            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.title }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>
                <div class="item-options">
                    <el-input v-model="props.item.value as string" placeholder="..." style="width: 100%" />
                </div>
            </div>
        </div>
        <div v-if="props.item.type === 'PathInput'" class="settings-item item-FilePath">
            <p :class="{ modifed: isDataConsistent }" class="item-name">
                {{ props.item.title }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>
                <div class="item-options">
                    <el-input class="path-item" v-model="props.item.value as string" placeholder="选择路径" />
                    <GlassButton class="path-item" @click="openPathChoose" type="primary" :icon="FolderOpened" circle
                        plain />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue';
import { open } from '@tauri-apps/plugin-dialog';
import { AppConfig, BooleanOptions, SelectOption } from '@/core/models';
import { PropType, ref, watch, watchEffect } from 'vue';

import { LogService } from '@/core/services';
import GlassButton from '../Common/GlassButton.vue';
import { useAppConfigStore } from '@/store';
const props = defineProps({
    item: {
        type: Object as PropType<AppConfig>,
        required: true
    }
})

const appConfigStore = useAppConfigStore();
const dbItem = ref<AppConfig | null>()

const isDataConsistent = ref(false);
watchEffect(async () => {
    dbItem.value = await appConfigStore.getDbAppConfig(props.item.key);
});
watch([() => props.item.value, dbItem], () => {
    if (dbItem.value) {
        isDataConsistent.value = (props.item.value !== dbItem.value.value);
    }
}, { immediate: true });

const openPathChoose = async () => {
    try {
        const file = await open({
            multiple: false,
            directory: true,
        });

        if (file && typeof file === 'string') {
            props.item.value = file;
        } else {
            // 用户取消选择或未选择有效路径
            LogService.warn('未选择有效的路径');
        }
    } catch (error: any) {
        LogService.error('打开路径选择器时发生错误:', error);
    }
};
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    transition: all .5s ease-in-out;
    margin: calc($globe-padding / 2) 0;
    overflow: hidden;

    .settings-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 4px;
        border: $simple-border;
        padding: calc($globe-padding / 2);
        transition: $simpel-transition-fast;
        background: none;

        .item-name {
            padding-top: calc($globe-padding / 4);
            font-weight: $font-weight-bold;
            flex: 1;
            display: flex;
            margin-left: $font-size;
            justify-content: left;
            align-items: center;
        }

        .item-container {
            margin-top: calc($globe-padding / 4);
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: stretch;
            width: calc(100% - $font-size);
            margin-left: $font-size;
            background: none;

            .item-desc {
                flex: 0.55;
                display: flex;
                align-items: center;
            }

            .item-options {
                flex: 0.45;
                display: flex;
                justify-content: flex-end;
                align-items: start;
                padding: calc($globe-padding / 4) 0;
                padding-left: calc($globe-padding / 8) !important;

                .path-item:first-child {
                    margin-right: calc($globe-margin / 4);
                }
            }
        }

        .item-text,
        .item-options {
            width: 50%;
            padding: calc($globe-padding / 4);
        }
    }
}

.settings-item:has(> .modifed) {
    background-color: $warning-color-alpha-3;
}

.modifed::before {
    content: "●";
    display: flex;
    justify-content: center;
    align-items: center;
    width: $font-size;
    height: $font-size;
    font-weight: $font-weight-bold;
    color: $warning-color;
    margin-left: - $font-size;
}
</style>
