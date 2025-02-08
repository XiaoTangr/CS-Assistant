<template>
    <div class="MainMenu-Container">
        <div class="MainMenu-Item" :class="{ active: isActive === index }" v-for="(item, index ) in routelist"
            @click="changeSubMenu(index)">
            {{ item.meta.text }}
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const changeSubMenu = (index: number) => {
    router.push({ path: routelist.value[index].path });
}
const routelist = ref();
const isActive = ref(0);
onMounted(() => {
    routelist.value = router.options.routes;
})
watchEffect(() => {
    routelist.value = router.options.routes;
    let currentRoutePath = router.currentRoute.value.matched[0] !== undefined ? router.currentRoute.value.matched[0].path : '/';
    isActive.value = routelist.value.findIndex((item: { path: string; }) => item.path === currentRoutePath);
});
</script>

<style scoped lang="scss">
.MainMenu-Container {
    width: 6em;
    overflow-y: auto;


    .MainMenu-Item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 5em;
    }

    .active {
        background: $menu-item-active-background;
        border-left: $traffic-light-yellow 4px solid;
    }

    .MainMenu-Item:hover {
        background-color: $menu-item-hover-background;
        transition: all 0.25s;
    }

}
</style>