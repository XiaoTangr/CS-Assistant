<template>
    <div>
        首页-蚂蚁在爬
        <div class="l" v-for="i in 50">{{ i }}</div>

    </div>
</template>

<script setup lang="ts">
import DBCoon from "@/utils/DataService/DbInstall";
import { onMounted } from 'vue';

onMounted(async () => {
    const db = new DBCoon;
    if (!await db.installCheck()) {
        alert("Loading database failed! Installing");
        db.tableCreate();
        db.dataInsert();
    }
})
</script>

<style scoped lang="scss"></style>