<template>
    <GlassCard class="container" shadow="never" body-class="content">
        <template #header>
            <el-text>
                我们目前提供一些网站来帮助你创建按键绑定, 在稍后我们将内置这些网站的某些功能。
            </el-text>
            <br>
            <el-text type="danger">
                这些网站内容由第三方提供，我们不保证其内容是否安全。
            </el-text>
        </template>
        <template #default>
            <div v-for="(group, idx) in linkData" class="group">
                <el-text class="group-name">{{ idx }}</el-text>
                <div class="items">
                    <ThirdLink class="item" v-for="item in group" :key="item.title" type="button" :url="item.url"
                        :title="item.title" />
                </div>
            </div>
        </template>
    </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from '@/components/Common/GlassCard.vue';
import ThirdLink from '@/components/Public/ThirdLink.vue';
const linkData = {
    "中文": [
        {
            title: 'profilerr-bind-generator',
            url: 'https://profilerr.net/zh/cs-go/bind-generator/',
        }
    ],
    "其他": [
        {
            title: 'cs2bindsgenerator',
            url: 'https://www.cs2bindsgenerator.com/',
        }
    ],
};
</script>

<style scoped lang="scss">
.container {
    width: 100%;

    .header {
        width: 100%;
    }

    :deep(.content) {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .group {
            display: flex;
            flex-direction: column;
            width: 70%;

            .group-name {
                margin: 1rem;
            }

            .items {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;


                .item {
                    margin: calc($globe-margin / 2);
                }
            }
        }
    }


}
</style>
