<template>
    <div class="container">
        <SettingsItem chapter="appSettings" section="pathSettings" />
    </div>
</template>

<script setup lang="ts">
import SettingsItem from '@/components/Forms/appSettings/SettingsItem.vue';
import { onMounted, ref } from 'vue';

import { MapDO } from '@/DBA/DO/MapDO';
import { useMapStore } from '@/store/MapStore';

const mapStore = useMapStore();

const data = ref<MapDO[]>([])

onMounted(() => {
    data.value = mapStore.data
})
</script>

<style scoped></style>