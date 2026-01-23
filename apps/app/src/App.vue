<template>
    <div class="App-Container" @contextmenu.prevent="openMenu()">
        <el-config-provider :locale="zhCn">
            <div class="gird-container">
                <div class="titleBar-container">
                    <TitleBar />
                </div>
                <div class="sideBar-container">
                    side bar
                </div>
                <div class="main-container">
                    <RouterView />
                </div>
            </div>
            <BackGround />
        </el-config-provider>
    </div>
</template>
<script setup lang="ts">
import { zhCn } from 'element-plus/es/locales.mjs';
import BackGround from './components/Layouts/BackGround.vue';
import LogService from '@/core/services/Log.service';


const openMenu = () => {
    LogService.info('User try open contextmenu!')
}

</script>

<style lang="scss" scoped>
.gird-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-gap: .5rem;
    background-color: rgba(250, 250, 250, 0.95);
    grid-template-columns: calc(48px + .5rem)1fr 1fr;
    grid-template-rows: 32px 1fr 1fr;

    .titleBar-container {
        grid-area: 1 / 1 / 1 / 4;
        box-shadow: $simple-box-shadow;
        border-bottom: 1px solid $color-border-base;
    }


    .sideBar-container {
        margin-left: .5rem;
        grid-area: 2 / 2 / 4 / 1;
    }

    .main-container {
        margin-right: .5rem;
        grid-area: 2 / 2 / 4 / 4;
    }
}
</style>
