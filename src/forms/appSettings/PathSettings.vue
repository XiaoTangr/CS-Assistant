<template>
    <div>
        <GamePathSettings :renderData="data" />
    </div>
</template>

<script setup lang="ts">
import GamePathSettings from "@/components/Forms/appSettings/SettingsItemRender.vue"

import { ref } from 'vue'

const data = ref([{
    key: 'steamInstallPath',
    text: 'Steam安装路径',
    type: 'PathInput',
    selected: "ddd",
    options: []
}, {
    key: 'steamLibraryWithCS',
    text: 'Steam库(包含CS2)',
    type: 'PathInput',
    selected: 'light',
    options: []
}])


</script>

<style scoped></style>