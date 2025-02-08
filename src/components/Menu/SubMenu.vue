<template>
    <div class="SubMenu-Container">
        <div class="SubMenu-Item" :class="{ active: isActive === index }" v-for="(item, index) in renderRouteList"
            @click="changeSubMenu(index)">
            {{ item.meta.text }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isActive = ref(0);
const changeSubMenu = (index: number) => {
    router.push({ path: renderRouteList.value[index].path });
}
const renderRouteList = ref();

watchEffect(() => {
    renderRouteList.value = route.matched[0].children;
    isActive.value = route.matched[0].children.findIndex(item => item.path === route.fullPath);
});
</script>

<style scoped lang="scss">
.SubMenu-Container {
    width: 9em;
    overflow-y: auto !important;

    .SubMenu-Item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2em;
    }

    .SubMenu-Item:hover {
        background-color: $menu-item-hover-background;
        transition: all 0.25s;
    }

    .active {
        background: $menu-item-active-background;
        border-right: $traffic-light-yellow 4px solid,;
    }

}
</style>