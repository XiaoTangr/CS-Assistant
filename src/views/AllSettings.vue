<template>
    <div class="all-settings-container">
        <div class="group-container" v-for="(g, i) in groupedViewData" :key="i">
            <div class="item-container">
                <el-divider content-position="left">{{ i }}</el-divider>
                <SettingsItemRender class="settings-item" v-for="(item) in g" :item="item"
                    :viewSettingsDataItem="item" />
            </div>
        </div>
        <el-space class="operate-container" :size="24">
            <LiquidButton size="large" @click="SettingsStore.saveChangedViewData" type="primary" text round> 保存更改
            </LiquidButton>
            <LiquidButton size="large" @click="SettingsStore.discardChanges" round> 放弃更改 </LiquidButton>
        </el-space>
    </div>
</template>
<script setup lang="ts">
import LiquidButton from '@/components/Common/LiquidButton.vue';
import SettingsItemRender from '@/components/Public/SettingsItemRender.vue';
import { useSettingsStore } from '@/store/SettingsStore';
import { storeToRefs } from 'pinia';

const SettingsStore = useSettingsStore();
const { groupedViewData } = storeToRefs(SettingsStore);

</script>

<style scoped lang="scss">
.all-settings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
    transition: $simpel-transition;

    .operate-container {
        position: sticky;
        bottom: 24px;
        right: 24px;
        margin-top: 24px;
        align-self: flex-end; // 如果父容器是 flex 布局，可进一步确保右对齐
        margin-left: auto; // 可选：如果希望元素本身右对齐
    }

    .group-container {
        margin-top: calc($globe-margin / 2);
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .item-container {
            width: 100%;
        }



        .settings-item {
            margin: calc($globe-margin / 4);
        }

        .settings-item:first-child {
            margin-top: 0;
            // background-color: red;
        }
    }

    .group-container:first-child {
        margin-top: 0;
        // background-color: red;
    }

    .group-container:last-child {
        margin-bottom: 0;
    }
}

@media screen and (max-width: 1024px) {
    .all-settings-container {
        width: 100%;
    }
}
</style>