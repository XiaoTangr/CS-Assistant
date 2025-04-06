<template>
    <div class="container">
        <SettingsItemRender chapter="appSettings" section="pathSettings" />
    </div>
</template>

<script setup lang="ts">
import SettingsItemRender from '@/components/Renders/SettingsItemRender.vue';
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