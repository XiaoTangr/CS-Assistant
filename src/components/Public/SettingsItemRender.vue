<template>
    <div class="container ">
        <div v-if="unSavedSettingsItem.type === 'Boolean'" class="settings-item   item-Boolean">
            <p :class="{ modifed: !SettingsStore.isDataConsistent(unSavedSettingsItem.key) }" class="item-name">{{
                unSavedSettingsItem.text }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ unSavedSettingsItem.description }}
                </div>

                <div class="item-options">
                    <el-switch v-model="unSavedSettingsItem.selected" :active-text="unSavedSettingsItem.options[0].text"
                        :inactive-text="unSavedSettingsItem.options[1].text" />
                </div>
            </div>
        </div>
        <div v-if="unSavedSettingsItem.type === 'Select'" class="settings-item item-Select">

            <p :class="{ modifed: !SettingsStore.isDataConsistent(unSavedSettingsItem.key) }" class="item-name">{{
                unSavedSettingsItem.text }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ unSavedSettingsItem.description }}
                </div>

                <div class="item-options">
                    <el-select v-model="unSavedSettingsItem.selected" placeholder="Select" style="width: 100%">
                        <el-option v-for="i in unSavedSettingsItem.options" :key="i.value" :label="i.text"
                            :value="i.value" />
                    </el-select>
                </div>
            </div>
        </div>
        <div v-if="unSavedSettingsItem.type === 'Input'" class="settings-item  item-Input">
            <p :class="{ modifed: !SettingsStore.isDataConsistent(unSavedSettingsItem.key) }" class="item-name">{{
                unSavedSettingsItem.text }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ unSavedSettingsItem.description }}
                </div>
                <div class="item-options">
                    <el-input v-model="unSavedSettingsItem.selected" placeholder="..." style="width: 100%" />
                </div>
            </div>
        </div>
        <div v-if="unSavedSettingsItem.type === 'PathInput'" class="settings-item item-FilePath">
            <p :class="{ modifed: !SettingsStore.isDataConsistent(unSavedSettingsItem.key) }" class="item-name">{{
                unSavedSettingsItem.text
                }}
            </p>
            <div class="item-container">
                <div class="item-desc">
                    {{ unSavedSettingsItem.description }}
                </div>
                <div class="item-options">
                    <el-input class="path-item" v-model="unSavedSettingsItem.selected" placeholder="选择路径" />
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
import { Settings } from '@/models/Settings.model';
import { PropType } from 'vue';
import { useSettingsStore } from '@/store/SettingsStore';
const props = defineProps({
    key: {
        type: String,
        // required: true
    },
    unSavedSettingsItem: {
        type: Object as PropType<Settings>,
        required: true
    }
})

const SettingsStore = useSettingsStore();

const openPathChoose = async () => {
    try {
        const file = open({
            multiple: false,
            directory: true,
        });
        if (file !== null && typeof file === 'string') {
            props.unSavedSettingsItem.selected = file;
        }
    } catch (error: any) {
        throw error;
    }
};
</script>

<style scoped lang="scss">
.container {
    width: 60%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    transition: all .5s;
    margin: calc($globe-padding / 2) 0;


    .settings-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 4px;
        border: $simple-border;
        padding: calc($globe-padding / 2);

        .item-name {
            padding-top: calc($globe-padding / 4);
            font-weight: $font-weight-bold;
            width: 100%;
            display: flex;
            margin-left: $font-size;
            justify-content: left;
            align-items: center;
        }



        .item-container {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
            width: calc(100% - $font-size);
            margin-left: $font-size;

            .item-options {
                display: flex;
                justify-content: right;
                align-items: center;

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

.modifed::before {
    content: "●";
    display: flex;
    justify-content: center;
    align-items: center;
    width: $font-size;
    height: $font-size;
    font-weight: $font-weight-bold;
    color: $mac-yellow;
    margin-left: - $font-size;
}

@media screen and (max-width: 1024px) {

    .container {
        width: 100%;
    }
}
</style>