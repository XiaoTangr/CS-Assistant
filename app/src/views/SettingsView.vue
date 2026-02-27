<template>
    <div v-for="(group, group_idx) in orderedSettings">
        <strong>{{ group_idx }}</strong>
        <SettingsItem v-for="item in group" :config="item" />
    </div>
</template>

<script setup lang="ts">
import { SETTINGS_DATA, SETTINGS_GROUP } from '@/core/config/settings-config';
import { configData } from '@/core/types/settings';
import { computed, ComputedRef } from 'vue';


const orderedSettings: ComputedRef<configData> = computed(() => {
    // 按照SETTINGS_GROUP的数字从小到大将分组排序后再从小到大排序分组内成员
    const sortedGroups: configData = {};

    // 获取所有分组并按SETTINGS_GROUP的数值排序
    const groupEntries = Object.entries(SETTINGS_DATA)
        .sort(([groupA], [groupB]) => {
            const orderA = SETTINGS_GROUP[groupA as keyof typeof SETTINGS_GROUP];
            const orderB = SETTINGS_GROUP[groupB as keyof typeof SETTINGS_GROUP];
            return (orderA ?? Infinity) - (orderB ?? Infinity);
        });

    // 对每个分组内的设置项按order排序
    groupEntries.forEach(([groupName, items]) => {
        if (items) {
            sortedGroups[groupName] = [...items].sort((a, b) => a.order - b.order);
        }
    });

    return sortedGroups;
});


</script>

<style scoped lang="scss"></style>