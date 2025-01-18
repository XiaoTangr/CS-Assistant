<template>
    <div data-tauri-drag-region class="TitleBar-Container">
        <div data-tauri-drag-region class="titlebar ControlButBar">
            <a class="light red " id="titlebar-close" @click="CloseWindow" />
            <a class="light yellow" id="titlebar-toggleMaximize" @click="toggleMaximizeWindow" />
            <a class="light green " id="titlebar-minimize" @click="MinimizeWindow" />
        </div>
        <div data-tauri-drag-region class="WindowInfoBar">
            唐人院不能没有樱岛麻衣！
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

const CloseWindow = () => appWindow.close();
const toggleMaximizeWindow = () => appWindow.toggleMaximize()
const MinimizeWindow = () => appWindow.minimize()
</script>

<style scoped>
.TitleBar-Container {

    display: flex;
    width: 100%;
    height: 32px;
    justify-content: center;
    align-items: center;

    * {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ControlButBar {
        position: absolute;
        left: 5px;
        /* top:8px; */

        .light {
            display: flex;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin: 5px;
            cursor: pointer;
            text-align: center;
            justify-content: center;
            color: #fff;
        }

        .light:hover {
            opacity: 0.8;
        }

        .yellow {
            background-color: #ffbf2b;
        }

        .red {
            background-color: #fd6458;
        }

        .green {
            background-color: #24cc3d;
        }
    }

    .WindowInfoBar {
        flex: 1;
    }
}
</style>