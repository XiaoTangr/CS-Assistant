<template>
    <div class="content-bar">
        <div class="Menu-Container">
            <MainMenu />
            <RouterView />
        </div>
        <div class="content-Container">
            <RouterView name="content">
                <RouterView />
            </RouterView>
        </div>
        <ViewCheck />
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import MainMenu from '@/components/Menu/MainMenu.vue';
import ViewCheck from '@/components/Layouts/ViewCheck.vue';
</script>

<style scoped lang="scss">
.content-bar {
    display: flex;
    // flex-direction: column;
    height: 100%;

    .Menu-Container {
        border-radius: 4px;
        display: flex;
        width: 15em;
        backdrop-filter: $globe-backdrop-filter;
        border: $simple-border;
        border-radius: $globe-border-radius;
        box-shadow: $menu-box-shadow;
    }

    .content-Container {
        flex: 1;
        background: $content-background-color;
        margin-left: $globe-margin;
        padding: $globe-padding;
        border: $simple-border;
        border-radius: $globe-border-radius;
        display: flex;
        flex-direction: column;
        overflow-y: auto !important;
    }
}
</style>