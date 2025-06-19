<template>
    <div class="window-command-container">
        <div class="window-command-group">

            <el-space alignment="start" :size="16">
                <div class="window-command-item liquid-button red" id="header-bar-close" @click="CloseWindow">
                    <el-icon class="inicon" size="70%">
                        <Close />
                    </el-icon>
                </div>

                <div class="window-command-item  liquid-button yellow" id="header-bar-toggleMaximize"
                    @click="MinimizeWindow">
                    <el-icon class="inicon" size="70%">
                        <Minus />
                    </el-icon>
                </div>
                <div class="window-command-item liquid-button green " id="header-bar-minimize"
                    @click="toggleMaximizeWindow">
                    <el-icon class="inicon" size="70%">
                        <FullScreen />
                    </el-icon>
                </div>
            </el-space>
        </div>
        <div class="window-info">
            <el-image class="icon" :src="AppIcon" />
            <h2 class="text">CS Assistant</h2>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Window } from '@tauri-apps/api/window';
import AppIcon from '@/assets/imgs/app-icon.png';
const appWindow = new Window('main');

const CloseWindow = () => {
    appWindow.close()
};
const toggleMaximizeWindow = () => appWindow.toggleMaximize()
const MinimizeWindow = () => appWindow.minimize()

</script>

<style lang="scss" scoped>
.window-command-container {
    width: 100%;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;




    .window-command-group {
        -webkit-app-region: drag;
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 16px;
        justify-content: start;
        align-items: center;

        .window-command-item {
            display: flex;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            // margin: 5px;
            cursor: pointer;
            text-align: center;
            justify-content: center;
            transition: ease-in-out;

            .inicon {
                height: 100%;
                width: 100%;
                opacity: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .inicon:hover {
                opacity: 1;
            }
        }

        .window-command-item:hover {
            opacity: 0.75;
        }

        .yellow {
            background-color: $mac-yellow;
        }

        .red {
            background-color: $mac-red;
        }

        .green {
            background-color: $mac-green;
        }
    }

    .window-info {
        margin: .5em;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .icon {
            width: 64px;
            height: 60px;
            border-radius: 50%;
            box-shadow: $simple-box-shadow;
            border: $simple-border;

        }

        .text {
            margin-top: .5em;
        }
    }
}
</style>