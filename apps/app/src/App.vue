<template>
    <div class="App-Container" @contextmenu.prevent="openMenu()">
        <NavBar class="nav-Container" />
        <div class="window-Container-bg">
            <div class="window-container">
                <div class="global-command-container">
                    <GlobalCommand />
                </div>
                <div id="content" class="content-container">
                    <RouterView />
                </div>
            </div>
        </div>
        <ViewCheck />
        <BackGround />
    </div>
</template>
<script setup lang="ts">
import BackGround from './components/Layouts/BackGround.vue';
import NavBar from './components/Layouts/NavBar.vue';
import ViewCheck from './components/Layouts/ViewCheck.vue';
import GlobalCommand from './components/Public/GlobalCommand.vue';
import LogServices from '@/core/services/Log.services';
const openMenu = () => {
    LogServices.info('User try open contextmenu!')
}

</script>

<style lang="scss" scoped>
.App-Container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    border: $simple-border;

    .nav-Container {
        height: 100vh;
        min-width: 20em;
        max-width: 20em;
        /* 添加定位属性 */
    }

    .window-Container-bg {
        flex: 1;
        background: rgba(250, 250, 250, 0.95);

        .window-container {
            overflow-y: auto;
            height: 100vh;
            margin-right: calc($globe-margin /2);

            .global-command-container {
                position: sticky;
                top: 0;
                padding-left: 0;
            }

            .content-container {
                padding: $globe-padding;
                padding-left: 0;
                padding-top: 0;
                padding-right: 1em;
                overflow-y: auto;
                width: 100%;
            }
        }
    }
}
</style>
