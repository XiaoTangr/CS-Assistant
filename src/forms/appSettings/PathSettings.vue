<template>
    <div>
        <SettingsItemRender :renderData="data" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePathSettings } from '@/store/appSettings/PathSettingsStore';
import SettingsItemRender from '@/components/Layouts/SettingsItemRender.vue';

const PathSettings = usePathSettings();


const data = ref<Array<SettingsRow>>([])



onMounted(() => {
    data.value = PathSettings.rdata

})
</script>

<style scoped></style>