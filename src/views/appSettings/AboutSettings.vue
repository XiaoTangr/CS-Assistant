<template>
    <div>
        <div>以下是读取到的Steam配置文件内容</div>
        <pre>{{ vdfo }}</pre>
    </div>
</template>

<script setup lang="ts">

import { getVdfObjectByFilePath } from '@/core/utils/VdfUtil';
import { onMounted, ref } from 'vue';

const vdfo = ref();


onMounted(async () => {
    const p1 = 'D:\\Program Files (x86)\\Steam\\userdata\\907438300\\config\\localconfig.vdf'
    // const path = "D:\\Program Files (x86)\\Steam\\config\\config.vdf";
    vdfo.value = await getVdfObjectByFilePath(p1)
    console.log(vdfo.value.UserLocalConfigStore.friends[323474316])
})

</script>

<style scoped lang="scss"></style>