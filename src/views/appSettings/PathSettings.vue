<template>
    <div class="container">
        <SettingsItem chapter="appSettings" section="pathSettings" />
    </div>
</template>

<script setup lang="ts">
import SettingsItem from '@/components/views/appSettings/SettingsItem.vue';
import { onMounted, ref } from 'vue';
import { useMapStore } from '@/store/MapStore';
import { Map } from '@/models/Map.model';

const mapStore = useMapStore();

const data = ref<Map[]>([])

onMounted(() => {
    data.value = mapStore.data
})
</script>

<style scoped></style>