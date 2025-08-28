<template>
    <div class="container-bg">
        <GlassCard class="container" bodyClass="nav-body">
            <WindowCommand />
            <el-space :size="4" class="nav-container" direction="vertical" alignment="stretch">
                <div v-for="(item) in mainRouterConfig">
                    <div v-if="hasRoute(item.name)" @click="navHandler(item.path)"
                        :class="['nav-item-container', { 'nav-active': route.fullPath === item.path }]">
                        <div class="icon">
                            <DynamicIcon :icon="item.meta?.icon" />
                        </div>
                        <div class="text">
                            {{ item.meta.text }}
                        </div>
                    </div>
                </div>
            </el-space>
            <el-space :size="4" class="nav-footer" direction="vertical" alignment="stretch">
                <div v-for="(item) in footerRouterConfig">
                    <div bodyClass="nav-item-body" v-if="hasRoute(item.name)" @click="navHandler(item.path)"
                        :class="['nav-item-container', { 'nav-active': route.fullPath === item.path }]">
                        <div class="icon">
                            <DynamicIcon :icon="item.meta?.icon" />
                        </div>
                        <div class="text">
                            {{ item.meta.text }}
                        </div>
                    </div>
                </div>
            </el-space>
        </GlassCard>
    </div>


</template>

<script setup lang="ts">
import WindowCommand from '@/components/Public/WindowCommand.vue'

import { mainRouterConfig, footerRouterConfig } from '@/router/RoutesCfg';
import DynamicIcon from '../Common/DynamicIcon.vue';
import { useRoute, useRouter } from 'vue-router';
import GlassCard from '../Common/GlassCard.vue';
import { LogService } from '@/core/services';

const route = useRoute();
const router = useRouter();

const navHandler = (routeName: string) => {
    router.push({ path: routeName }).catch(err => {
        LogService.error('Navigation failed:', err)
    })
}


// 提供一个函数用来事实判断是否有路由，参数为路由名称
const hasRoute = (routeName: string) => {
    return router.hasRoute(routeName)
}

</script>

<style lang="scss" scoped>
:deep(.nav-item-body) {
    display: flex;
}


// app顶部的白色阴影，放在此处方便处理z-index
.container-bg::before {
    content: '';
    background: $font-color;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 5em;
    backdrop-filter: blur(100vw);
    -webkit-backdrop-filter: blur(100vw);
    mask: linear-gradient(to bottom,
            rgba(0, 0, 0, 1) 20%,
            rgba(0, 0, 0, .75) 60%,
            rgba(0, 0, 0, 0) 100%);
}

.container-bg {
    width: 100%;
    height: 100%;
    padding: 1em;
    background: linear-gradient(to right,
            rgba(250, 250, 250, 0.2),
            rgba(250, 250, 250, 0.6),
            rgba(250, 250, 250, 0.8),
            rgba(250, 250, 250, 0.95));

    .container {
        // opacity: 0;
        height: 100%;
        width: 100%;
        display: flex;

        flex-direction: column;
        overflow: hidden;
        border-radius: 1em;


        :deep(.nav-body) {
            padding: 0;
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            border: $simple-border;

            .nav-container {
                width: 100%;
                flex: 1;
                overflow-y: auto;
                padding: calc($globe-padding / 2) $globe-padding;
                padding-top: 1.5em;
            }

            .nav-footer {
                width: 100%;
                padding: calc($globe-padding / 2) $globe-padding;
                padding-bottom: $globe-margin;
            }

            .nav-active {
                background: linear-gradient(to right,
                        rgba(250, 250, 250, 0.7),
                        rgba(250, 250, 250, 0.2));
                color: $primary-color !important;
                box-shadow: 0px 0px 32px rgba(31, 38, 135, 0.12);
            }

            .nav-item-container {
                width: 100%;
                height: calc(2 * $font-size);
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                overflow: hidden;
                border-radius: $globe-border-radius;


                .text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: center;
                }

                .icon {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    font-size: calc(1 * $font-size);
                    margin-right: calc(0.5 * $font-size);
                }
            }

            .nav-item-container:hover {
                background: linear-gradient(to right,
                        rgba(250, 250, 250, 0.8),
                        rgba(250, 250, 250, 0.2));
                // border-left: rgba(250, 250, 250, ) solid 4px;
                color: $primary-color !important;
                transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .nav-active::before,
            .nav-item-container::before {
                content: '';
                width: .5em;
                height: 0em;
                border-radius: 100vw;
                margin: calc(0.5 * $font-size);
                transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .nav-active::before {
                background-color: $primary-color ;
                height: $font-size;
            }


        }
    }
}
</style>
