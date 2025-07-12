<template>
    <div class="window-command-container">
        <div class="window-command-group">
            <CommSpace direction="horizontal" alignment="start">
                <div :class="{ 'not-infocus': !isFocused }" class="window-command-item liquid-button red"
                    id="header-bar-close" @click="centerDialogVisible = true">
                    <el-icon class="inicon" size="70%">
                        <Close />
                    </el-icon>
                </div>

                <div :class="{ 'not-infocus': !isFocused }" class="window-command-item  liquid-button yellow"
                    id="header-bar-toggleMaximize" @click="MinimizeWindow">
                    <el-icon class="inicon" size="70%">
                        <Minus />
                    </el-icon>
                </div>
                <div :class="{ 'not-infocus': !isFocused }" class="window-command-item liquid-button green "
                    id="header-bar-minimize" @click="toggleMaximizeWindow">
                    <el-icon class="inicon" size="70%">
                        <Plus />
                    </el-icon>
                </div>
            </CommSpace>
        </div>
        <div class="window-info">
            <el-image class="icon" :src="AppIcon" />
            <h2 class="text">CS Assistant</h2>
        </div>
        <el-dialog :close-on-click-modal="false" append-to="#app" width="400" v-model="centerDialogVisible"
            align-center>
            <template #header>

                <span class="dg-title">
                    <el-icon class="dg-icon">
                        <WarningFilled />
                    </el-icon>
                    注意
                </span>

            </template>
            <template #default> 所有未保存的更改都会消失! </template>
            <template #footer>
                <LiquidButton round size="large" @click="CloseWindow()">
                    确定
                </LiquidButton>
                <LiquidButton round size="large" type="success" @click="centerDialogVisible = false">取消</LiquidButton>

            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Window } from '@tauri-apps/api/window';
import AppIcon from '@/assets/icons/app/app-icon.png';
import CommSpace from '../Common/CommSpace.vue';
import { ref } from 'vue';
import LiquidButton from '../Common/LiquidButton.vue';
const appWindow = new Window('main');

const centerDialogVisible = ref(false)


const isFocused = ref(false);
const isLoading = ref(false);

// 主动刷新焦点状态
const refreshFocus = async () => {
    isLoading.value = true;
    isFocused.value = await appWindow.isFocused();
};

// 初始化监听
appWindow.listen('tauri://focus', () => {
    isFocused.value = true;
});

appWindow.listen('tauri://blur', () => {
    isFocused.value = false;
});

// 首次加载获取状态
refreshFocus();
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
        padding: 1em;
        justify-content: start;
        align-items: center;




        .window-command-item {

            display: flex;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            box-shadow: $simple-box-shadow;
            cursor: pointer;
            text-align: center;
            justify-content: center;
            transition: $simpel-transition-faster;

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

        .not-infocus {
            background-color: $mac-gray !important;
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
            width: 6em;
            height: 6em;
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
<style lang="scss">
.dg-title {
    display: flex;
    align-items: center;
}

.dg-icon {
    margin-right: 4px;
    color: $danger-color;
}
</style>