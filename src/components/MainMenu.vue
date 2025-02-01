<template>
    <div>
        <div class="MainMenu" v-for="item in routelist">
            <RouterLink :to="item.path"  > {{ item.path }}</RouterLink>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
// 获取所有路由列表
const routelist = router.options.routes;
console.log(routelist);
</script>

<style scoped></style>