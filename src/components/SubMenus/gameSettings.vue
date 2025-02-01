<template>
    <div>
        app
        <div class="MainMenu" v-for="item in routelist" @click="app">
            <RouterLink :to="item.path"> {{ item.path }}</RouterLink>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
// 获取所有路由列表
const routelist = router.options.routes[2].children;
const app = () => {
    console.log(route.path);
}
console.log("routelist````");
console.log(routelist);
</script>

<style scoped></style>