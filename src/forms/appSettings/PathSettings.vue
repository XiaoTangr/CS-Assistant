<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePathSettings } from '@/store/appSettings/PathSettingsStore';

const PathSettings = usePathSettings();


const data = ref<Array<SettingsRow>>([])

onMounted(() => {
    data.value = PathSettings.rdata
})
</script>

<style scoped></style>