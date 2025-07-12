<template>
    <div class="container">
        <div class="main-layout ">
            <div class="main-container liquid-card  ">
                <WindowCommand />
                <el-space :size="4" class="nav-container" direction="vertical" alignment="stretch">
                    <div v-for="(item) in RouterConfig" @click="navHandler(item.path)"
                        :class="['nav-item-container', { 'nav-active': route.fullPath === item.path }]">
                        <div class="icon">
                            <DynamicIcon :icon="item.meta?.icon" />
                        </div>
                        <div class="text">
                            {{ item.meta.text }}
                        </div>
                    </div>
                </el-space>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import WindowCommand from '@/components/Public/WindowCommand.vue'

import { RouterConfig } from '@/router/RoutesCfg';
import DynamicIcon from '../Common/DynamicIcon.vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const navHandler = (routeName: string) => {
    router.push({ path: routeName }).catch(err => {
        console.error('Navigation failed:', err)
    })
}
</script>

<style lang="scss" scoped>
.container {
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: 1em;
    background: linear-gradient(to right,
            rgba(250, 250, 250, 0.7),
            rgb(250, 250, 250));

    overflow: hidden;

    .main-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 1em;


        .main-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 1em;
            border: $simple-border;
            z-index: 99;

            .nav-container {
                padding: calc($globe-padding / 2) $globe-padding;
                width: 100%;
                height: 100%;



                .nav-item-container {
                    background: rgba(250, 250, 250, 0.4);
                    width: 100%;
                    height: calc(2 * $font-size);
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;
                    border-radius: 4px;
                    padding-left: 4px;
                    border-left: rgba(250, 250, 250, 0) solid 4px;
                    transition: all 0.2s ease-in-out;

                    .text {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        justify-content: center;
                    }

                    .icon {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        font-size: calc(1 * $font-size);
                        margin: calc(0.25 * $font-size);
                    }

                }

                .nav-active {
                    border-left: $mac-green solid 4px;
                    background: linear-gradient(to right,
                            rgba(250, 250, 250, 1),
                            rgba(250, 250, 250, 0.5));
                }

                .nav-item-container:hover {
                    // border-left: $mac-green solid 4px;
                    background: rgba(250, 250, 250, 0.8);
                    color: rgba(64, 160, 255, 1) !important;
                }
            }
        }
    }
}
</style>