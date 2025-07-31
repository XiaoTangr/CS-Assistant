<template>
    <div class="container ">
        <div v-if="props.item.type === 'Boolean'" class="settings-item item-Boolean">
            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.text }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>

                <div class="item-options">
                    <el-switch v-model="props.item.selected" :active-text="props.item.options?.[0].text"
                        :inactive-text="props.item.options?.[1].text" />
                </div>
            </div>
        </div>
        <div v-if="props.item.type === 'Select'" class="settings-item item-Select">

            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.text }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>

                <div class="item-options">
                    <el-select v-model="props.item.selected" placeholder="Select" style="width: 100%">
                        <el-option v-for="i in props.item.options" :key="i.value" :label="i.text" :value="i.value" />
                    </el-select>
                </div>
            </div>
        </div>
        <div v-if="props.item.type === 'Input'" class="settings-item item-Input">
            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.text }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>
                <div class="item-options">
                    <el-input v-model="props.item.selected" placeholder="..." style="width: 100%" />
                </div>
            </div>
        </div>
        <div v-if="props.item.type === 'PathInput'" class="settings-item item-FilePath">
            <p :class="{ modifed: isDataConsistent }" class="item-name">{{
                props.item.text
            }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ props.item.description }}
                </div>
                <div class="item-options">
                    <el-input class="path-item" v-model="props.item.selected" placeholder="选择路径" />
                    <el-button class="path-item" @click="openPathChoose" type="primary" :icon="FolderOpened" circle
                        plain />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue';
import { open } from '@tauri-apps/plugin-dialog';
import { Settings } from '@/core/models';
import { computed, PropType } from 'vue';
import { useSettingsStore } from '@/store/SettingsStore';
import { LogServices } from '@/core/services';
const props = defineProps({
    item: {
        type: Object as PropType<Settings>,
        required: true
    }
})

const SettingsStore = useSettingsStore();

const isDataConsistent = computed(() => {
    const dbValue = SettingsStore.getDbDataItemByKey(props.item.key as string)?.selected as string;
    return props.item.selected !== dbValue;
})

const openPathChoose = async () => {
    try {
        const file = await open({
            multiple: false,
            directory: true,
        });

        if (file && typeof file === 'string') {
            props.item.selected = file;
        } else {
            // 用户取消选择或未选择有效路径
            LogServices.warn('未选择有效的路径');
        }
    } catch (error: any) {
        LogServices.error('打开路径选择器时发生错误:', error);
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