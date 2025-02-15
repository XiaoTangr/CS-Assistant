<template>
    <div>
        <div>以下是读取到的Steam配置文件内容</div>
        <pre>{{ vdfo }}</pre>
    </div>
</template>

<script setup lang="ts">

import VdfUtil from '@/utils/VdfUtil';
import { onMounted, ref } from 'vue';

const vdfo = ref();


onMounted(async () => {
    const path = "D:\\Program Files (x86)\\Steam\\config\\config.vdf";
    vdfo.value = await VdfUtil.getVdfObjectbyFilePath(path)
    console.log(vdfo.value.InstallConfigStore.Software.Valve.steam.ShaderCacheManager.App)
})

</script>

<style scoped lang="scss"></style>