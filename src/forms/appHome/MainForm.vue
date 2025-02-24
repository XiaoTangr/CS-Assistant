<template>
    <div>
        首页-蚂蚁在爬
        <div class="l" v-for="i in 50">{{ i }}</div>

    </div>
</template>

<script setup lang="ts">

import MapDTO from '@/DBA/DTO/MapDTO';
import { DBinstall } from '@/DBA/Utils/DbInstall';
// import { ElNotification } from 'element-plus';
import { onMounted } from 'vue';

onMounted(async () => {
    DBinstall();
    const MapDto = new MapDTO();
    console.log((await MapDto.queryAll()));
    // await MapDto.insert([{ key: "test112111112", value: "test1" }])
})
</script>

<style scoped lang="scss"></style>