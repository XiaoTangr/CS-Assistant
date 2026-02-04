<template>
    <div class="container">
        <!-- 标题栏图标 -->
        <div class="titlebar-icon" style="-webkit-app-region: drag">
            <img src="./../assets/icons/app/app-icon.png" alt="" class="app-icon">
        </div>

        <!-- 标题栏按钮组 -->
        <div class="titlebar-btn-group nav">
            <div @click="backHandler" class="titlebar-btn back">
                <el-icon>
                    <Back />
                </el-icon>
            </div>
            <div @click="nextHandler" class="titlebar-btn next">
                <el-icon>
                    <Right />
                </el-icon>
            </div>
        </div>

        <!-- 标题栏标题 -->
        <div class="titlebar-title" style="-webkit-app-region: drag">
            {{ $route.meta.title }}
        </div>
        <!-- 标题栏按钮组 -->
        <div class="titlebar-btn-group cmd">
            <div @click="minimizeHandler" class="titlebar-btn minus">
                <el-icon>
                    <Minus />
                </el-icon>
            </div>
            <div @click="toggleMaximizeHandler" class="titlebar-btn maximize">
                <el-icon>
                    <FullScreen />
                </el-icon>
            </div>
            <div @click="centerDialogVisible = true" class="titlebar-btn close">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
        </div>

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
            <GlassButton round @click="closeHandler"> 确定 </GlassButton>
        </template>
    </GlassDialog>
</template>

<script setup lang="ts">

import { WarningFilled, Back, Right, Close, Minus, FullScreen } from '@element-plus/icons-vue';
import { Window } from '@tauri-apps/api/window';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const centerDialogVisible = ref(false);


const router = useRouter();
const nextHandler = () => {
    router.forward();
}
const backHandler = () => {
    router.back();
}




const appWindow = new Window('main');

const closeHandler = () => {
    appWindow.close()
};
const toggleMaximizeHandler = () => appWindow.toggleMaximize()
const minimizeHandler = () => appWindow.minimize()

</script>

<style scoped lang="scss">
.container {
    display: grid;
    width: 100%;
    grid-template-columns: 32px calc(48px * 2) 1fr calc(48px * 3);

    .titlebar-icon {
        padding: 8px;

        .app-icon {
            width: 16px;
            height: 16px;
        }
    }

    .titlebar-btn-group.nav {
        height: 32px;
        display: flex;
    }

    .titlebar-title {
        padding-left: 8px;
        line-height: 32px;
        font-size: 14px;
    }

    .titlebar-btn-group.cmd {
        height: 32px;
        display: flex;
        grid-area: 1 / 4 / 1 / 5;
    }

    .titlebar-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 32px;
    }

    .titlebar-btn:hover {
        background: rgb(255, 255, 255, 0.8);
    }

    .titlebar-btn:active {
        background: rgba(222, 222, 222, 0.8);
    }

    .titlebar-btn.close:hover {
        background: rgba(255, 0, 0, 0.8);
    }

    .titlebar-btn.close:active {
        background: rgba(222, 0, 0, 0.8);
        color: white;
    }
}
</style>