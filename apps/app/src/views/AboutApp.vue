<template>
    <div class="container">
        <GlassCard shadow="never" body-class="appinfo-body" class="card-item">
            <div class="appinfo">
                <div class="appinfo-item version-container">
                    <el-image class="appinfo-inneritem appIcon" :src="appIcon" />
                </div>
                <div class="appinfo-item version-ontainer">
                    <span class="appinfo-inneritem appName">CS Assistant</span>
                </div>

                <div class="appinfo-item version-container">
                    <span class="appinfo-inneritem appVersion ">Release Version: {{ appVersion }}</span>
                    <span class="appinfo-inneritem appInBuild ">Build Version: {{ appInBuild }}</span>
                </div>

                <div class="appinfo-item">
                    <GlassButton @click="show_license = true" type="primary" link class="appinfo-inneritem License">MIT
                        License</GlassButton>
                    <GlassButton type="primary" link class="appinfo-inneritem Copyright">
                        Copyright © 2025 XiaoTang. All rights reserved.
                    </GlassButton>
                </div>
                <div class="appinfo-item version-ontainer">
                    <ThirdLink :url="appGithub" class="appinfo-inneritem appGithub">
                        {{ `Project Repo: ${appGithub}` }}
                    </ThirdLink>
                </div>
            </div>
        </GlassCard>
        <GlassCard class="card-item" shadow="never">
            <template #header>
                感谢以下开源项目
            </template>
            <CommSpace :size="16" class="openSource" wrap alignment="start">
                <GlassCard class="item" v-for="item in openSourceData" body-class="item-body" shadow="hover">
                    <el-image class="icon" :src="item.iconUrl" fit="fill" />
                    <CommSpace :size="4" spacer="License by" class="info">
                        <ThirdLink :url="item.url" :title="item.name" />
                        <span>{{ item.license }}</span>
                    </CommSpace>
                </GlassCard>
            </CommSpace>
        </GlassCard>
        <GlassDialog fullscreen v-model="show_license">
            <div class="license">
                <pre class="content" v-html="LICENSE" />
                <GlassButton class="close" round type="primary" @click="show_license = false">确定</GlassButton>
            </div>
        </GlassDialog>
    </div>

</template>

<script setup lang="ts">
import CommSpace from '@/components/Common/CommSpace.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import ThirdLink from '@/components/Public/ThirdLink.vue';
import { onMounted, ref } from 'vue';
import appIcon from '@/assets/icons/app/app-icon.png';
import { useMapStore } from '@/store/MapStore';
import GlassButton from '@/components/Common/GlassButton.vue';
import GlassDialog from '@/components/Common/GlassDialog.vue';
import LICENSE from '@/assets/LICENSE.txt?raw';
const mapStore = useMapStore();
const appVersion = ref('');
const appInBuild = ref('');
const appGithub = ref('');
const show_license = ref(false);

onMounted(async () => {
    appVersion.value = (await mapStore.getOneByKey('App_Version'))?.value ?? '';
    appInBuild.value = (await mapStore.getOneByKey('App_InBuild'))?.value ?? '';
    appGithub.value = (await mapStore.getOneByKey('App_Github'))?.value ?? '';
})


const openSourceData = ref([
    {
        "name": "Tauri",
        "version": "^2",
        "url": "https://github.com/tauri-apps/tauri",
        "iconUrl": "https://github.com/tauri.png",
        "license": "MIT OR Apache-2.0"
    }, {
        "name": "Vue",
        "version": "^3.5.13",
        "url": "https://github.com/vuejs/vue",
        "iconUrl": "https://github.com/vuejs.png",
        "license": "MIT"
    }, {
        "name": "Pinia",
        "version": "^3.0.1",
        "url": "https://github.com/vuejs/pinia",
        "iconUrl": "https://github.com/vuejs.png",
        "license": "MIT"
    }, {
        "name": "Vue Router",
        "version": "4",
        "url": "https://github.com/vuejs/router",
        "iconUrl": "https://github.com/vuejs.png",
        "license": "MIT"
    }, {
        "name": "Vite",
        "version": "^8.0.0",
        "url": "https://github.com/vitejs/vite",
        "iconUrl": "https://github.com/vitejs.png",
        "license": "MIT"
    }, {
        "name": "Element Plus",
        "version": "^2.9.8",
        "url": "https://github.com/element-plus/element-plus",
        "iconUrl": "https://github.com/element-plus.png",
        "license": "MIT"
    }, {
        "name": "TypeScript",
        "version": "~5.6.2",
        "url": "https://github.com/microsoft/TypeScript",
        "iconUrl": "https://github.com/microsoft.png",
        "license": "Apache-2.0"
    }, {
        "name": "Sass",
        "version": "^1.84.0",
        "url": "https://github.com/sass/sass",
        "iconUrl": "https://github.com/sass.png",
        "license": "MIT"
    }, {
        "name": "Axios",
        "version": "^1.8.4",
        "url": "https://github.com/axios/axios",
        "iconUrl": "https://github.com/axios.png",
        "license": "MIT"
    }, {
        "name": "Autoprefixer",
        "version": "^10.4.21",
        "url": "https://github.com/postcss/autoprefixer",
        "iconUrl": "https://github.com/postcss.png",
        "license": "MIT"
    }, {
        "name": "CSSNano",
        "version": "^7.1.0",
        "url": "https://github.com/cssnano/cssnano",
        "iconUrl": "https://github.com/cssnano.png",
        "license": "MIT"
    }, {
        "name": "Github",
        "version": "NONE",
        "url": "https://github.com/",
        "iconUrl": "https://github.com/github.png",
        "license": "NONE"
    }
])
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .card-item {
        margin: 1em;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .appinfo {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .appinfo-item {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                margin-bottom: calc($globe-margin * .5);

                .appinfo-inneritem {
                    margin-left: calc($globe-margin * 2);
                }

                .appinfo-inneritem:first-child {
                    margin-left: 0;
                }

                .appIcon {
                    width: calc(5 * $font-size);
                    height: calc(5 * $font-size);
                }
            }

            .appinfo-item:last-child {
                margin-bottom: 0;
            }


        }


        .openSource {
            width: 100%;

            .item {
                :deep(.item-body) {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding: calc(0.25 * $font-size) calc(0.5 * $font-size);

                    .icon {
                        width: calc(2.5 * $font-size);
                        height: calc(2.5 * $font-size);
                        margin-right: $font-size;
                    }

                }
            }
        }
    }

    .card-item:last-child {
        margin-top: 0;
    }
}

.license {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .content {
        color: var(--el-text-color-primary);
        font-family: 'DefaultFont';
        margin-bottom: calc(2.5 * $font-size);
    }

    .close {
        margin: auto 0;
    }
}
</style>
