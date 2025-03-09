<template>
    <div>
        <p v-for="item in data">
            {{ item.key }} : {{ item.value }}
        </p>
    </div>
</template>

<script setup lang="ts">
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