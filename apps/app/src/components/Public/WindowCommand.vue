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
        <GlassDialog :close-on-click-modal="false" v-model="centerDialogVisible" align-center>
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
                <GlassButton autofocus round type="primary" @click="centerDialogVisible = false">取消</GlassButton>
                <GlassButton round @click="CloseWindow()"> 确定 </GlassButton>
            </template>
        </GlassDialog>
    </div>
</template>

<script setup lang="ts">
import { Window } from '@tauri-apps/api/window';
import AppIcon from '@/assets/icons/app/app-icon.png';
import CommSpace from '../Common/CommSpace.vue';
import { onMounted, ref } from 'vue';
import GlassButton from '../Common/GlassButton.vue';
import GlassDialog from '../Common/GlassDialog.vue';
import { Plus, Close, Minus, WarningFilled } from '@element-plus/icons-vue';
const appWindow = new Window('main');

const centerDialogVisible = ref(false)


const isFocused = ref(true);
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


const CloseWindow = () => {
    appWindow.close()
};
const toggleMaximizeWindow = () => appWindow.toggleMaximize()
const MinimizeWindow = () => appWindow.minimize()

onMounted(() => {
    // 首次加载获取状态
    refreshFocus();
});

</script>

<style lang="scss" scoped>
.window-command-container {
    width: 100%;

    /* 添加定位属性 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .window-command-group {
        -webkit-app-region: drag;
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 1rem;
        justify-content: start;
        align-items: center;

        /* 添加定位属性 */

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
        margin: .5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .icon {
            width: 6rem;
            height: 6rem;
            border-radius: 50%;
            box-shadow: $simple-box-shadow;
            border: $simple-border;
        }

        .text {
            margin-top: .5rem;
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
