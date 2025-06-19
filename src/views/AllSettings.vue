<template>
    <div class="all-settings-container">
        <SettingsItemRender class="settings-item" v-for="(item, index) in data" :item="item"
            :unSavedSettingsItem="unSavedData[index]" />
        <el-space class="operate-group" :size="24">
            <LiquidButton size="large" type="primary" text round> 保存更改 </LiquidButton>
            <LiquidButton size="large" round> 放弃更改 </LiquidButton>
        </el-space>
    </div>
</template>
<script setup lang="ts">
import LiquidButton from '@/components/Common/LiquidButton.vue';
import SettingsItemRender from '@/components/Public/SettingsItemRender.vue';
import { useSettingsStore } from '@/store/SettingsStore';
import { storeToRefs } from 'pinia';

const SettingsStore = useSettingsStore();

const { data, unSavedData } = storeToRefs(SettingsStore);

</script>

<style scoped lang="scss">
.all-settings-container {
    display: flex;
    flex-direction: column;
    align-items: center;


    .operate-group {
        position: sticky;
        bottom: 24px;
        right: 24px;
        align-self: flex-end; // 如果父容器是 flex 布局，可进一步确保右对齐
        margin-left: auto; // 可选：如果希望元素本身右对齐
    }

    .settings-item:first-child {
        margin-top: 0;
        // background-color: red;
    }

    .settings-item:last-child {
        margin-bottom: 0;
    }
}
</style>