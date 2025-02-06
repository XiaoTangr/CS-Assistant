<template>
    <div data-tauri-drag-region  class="TitleBar-Container">
        <div data-tauri-drag-region class="titlebar ControlButBar">
            <el-popconfirm icon-color="#fd6458" :icon="WarningFilled" width="16em" confirm-button-text="确定"
                cancel-button-text="取消" title="未保存的内容将会丢失!" @confirm="CloseWindow">
                <template #reference>
                    <a class="light red " id="titlebar-close" />
                </template>
            </el-popconfirm>
            <a class="light yellow" id="titlebar-toggleMaximize" @click="toggleMaximizeWindow" />
            <a class="light green " id="titlebar-minimize" @click="MinimizeWindow" />
        </div>
        <div data-tauri-drag-region class="WindowInfoBar">
            唐人院不能没有樱岛麻衣！
        </div>
    </div>
</template>

<script setup lang="ts">
import { Window } from '@tauri-apps/api/window';
import { WarningFilled } from '@element-plus/icons-vue';
const appWindow = new Window('main');

const CloseWindow = () => {
    appWindow.close()
};
const toggleMaximizeWindow = () => appWindow.toggleMaximize()
const MinimizeWindow = () => appWindow.minimize()

</script>

<style scoped lang="scss">
.TitleBar-Container {
    backdrop-filter: blur($windouwTitle-Blur);
    border: $simple-border;
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
            background-color: $traffic-light-yellow;
        }

        .red {
            background-color: $traffic-light-red;
        }

        .green {
            background-color: $traffic-light-green;
        }
    }

    .WindowInfoBar {
        flex: 1;
    }
}
</style>