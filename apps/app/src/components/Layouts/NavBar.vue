<template>
    <div class="container-bg">
        <GlassCard class="container" bodyClass="nav-body">
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
        </GlassCard>
    </div>


</template>

<script setup lang="ts">
import WindowCommand from '@/components/Public/WindowCommand.vue'

import { RouterConfig } from '@/router/RoutesCfg';
import DynamicIcon from '../Common/DynamicIcon.vue';
import { useRoute, useRouter } from 'vue-router';
import GlassCard from '../Common/GlassCard.vue';

const route = useRoute();
const router = useRouter();

const navHandler = (routeName: string) => {
    router.push({ path: routeName }).catch(err => {
        console.error('Navigation failed:', err)
    })
}


</script>

<style lang="scss" scoped>
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
                padding: calc($globe-padding / 2) $globe-padding;

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
                    background: rgba(250, 250, 250, 0.8);
                    color: rgba(64, 160, 255, 1) !important;
                }
            }
        }
    }
}
</style>