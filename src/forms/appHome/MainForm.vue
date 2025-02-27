<template>
    <div>
        首页-蚂蚁在爬
        <div class="l" v-for="i in 50">{{ i }}</div>

    </div>
</template>

<script setup lang="ts">

import MapDTO from '@/DBA/DTO/MapDTO';
import { DBinstall } from '@/DBA/Utils/DbInstall';
import { dbCUDRUtil } from '@/DBA/Utils/DBCUDRUtil';
// import { ElNotification } from 'element-plus';
import { onMounted } from 'vue';

onMounted(async () => {
    DBinstall();
    const MapDto = new MapDTO();

    // await MapDto.insert([{ key: "test112111112", value: "test1" }])

    console.log(await dbCUDRUtil.updateRow("Map", { key: "test", value: "test改了" }, "key", "test"))
    console.log((await MapDto.queryAll()));
})
</script>

<style scoped lang="scss"></style>