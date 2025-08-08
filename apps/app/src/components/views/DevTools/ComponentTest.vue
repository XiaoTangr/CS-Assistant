<template>
    <div class="container">
        <div>
            <div>
                <div class="mb-4">
                    <GlassButton shadow="always" type="primary">always</GlassButton>
                    <GlassButton shadow="hover" type="primary">hover</GlassButton>
                    <GlassButton shadow="never" type="primary">never</GlassButton>
                </div>
                <div class="mb-4">
                    <GlassButton link>link</GlassButton>
                    <GlassButton link type="primary">中文</GlassButton>
                    <GlassButton link type="success">中文</GlassButton>
                    <GlassButton link type="info">中文</GlassButton>
                    <GlassButton link type="warning">中文</GlassButton>
                    <GlassButton link type="danger">中文</GlassButton>
                </div>
                <div class="mb-4">
                    <GlassButton text>text</GlassButton>
                    <GlassButton text type="primary">中文</GlassButton>
                    <GlassButton text type="success">中文</GlassButton>
                    <GlassButton text type="info">中文</GlassButton>
                    <GlassButton text type="warning">中文</GlassButton>
                    <GlassButton text type="danger">中文</GlassButton>
                </div>
                <div class="mb-4">
                    <GlassButton>中文</GlassButton>
                    <GlassButton type="primary">中文</GlassButton>
                    <GlassButton type="success">中文</GlassButton>
                    <GlassButton type="info">中文</GlassButton>
                    <GlassButton type="warning">中文</GlassButton>
                    <GlassButton type="danger">中文</GlassButton>
                </div>

                <div class="mb-4">
                    <GlassButton plain>plain</GlassButton>
                    <GlassButton type="primary" plain>Primary</GlassButton>
                    <GlassButton type="success" plain>Success</GlassButton>
                    <GlassButton type="info" plain>Info</GlassButton>
                    <GlassButton type="warning" plain>Warning</GlassButton>
                    <GlassButton type="danger" plain>Danger</GlassButton>
                </div>

                <div class="mb-4">
                    <GlassButton round>Round</GlassButton>
                    <GlassButton type="primary" round>Primary</GlassButton>
                    <GlassButton type="success" round>Success</GlassButton>
                    <GlassButton type="info" round>Info</GlassButton>
                    <GlassButton type="warning" round>Warning</GlassButton>
                    <GlassButton type="danger" round>Danger</GlassButton>
                </div>

                <div>
                    <GlassButton :icon="Search" circle />
                    <GlassButton type="primary" :icon="Edit" circle />
                    <GlassButton type="success" :icon="Check" circle />
                    <GlassButton type="info" :icon="Message" circle />
                    <GlassButton type="warning" :icon="Star" circle />
                    <GlassButton type="danger" :icon="Delete" circle />
                </div>
            </div>
            <div>
                <div class="mb-4">
                    <el-buttontext>Default text</el-buttontext>
                    <el-button type="primary">Primary</el-button>
                    <el-button type="success">Success</el-button>
                    <el-button type="info">Info</el-button>
                    <el-button type="warning">Warning</el-button>
                    <el-button type="danger">Danger</el-button>
                </div>
                <div class="mb-4">
                    <el-button>Default</el-button>
                    <el-button type="primary">Primary</el-button>
                    <el-button type="success">Success</el-button>
                    <el-button type="info">Info</el-button>
                    <el-button type="warning">Warning</el-button>
                    <el-button type="danger">Danger</el-button>
                </div>

                <div class="mb-4">
                    <el-button plain>Plain</el-button>
                    <el-button type="primary" plain>Primary</el-button>
                    <el-button type="success" plain>Success</el-button>
                    <el-button type="info" plain>Info</el-button>
                    <el-button type="warning" plain>Warning</el-button>
                    <el-button type="danger" plain>Danger</el-button>
                </div>

                <div class="mb-4">
                    <el-button round>Round</el-button>
                    <el-button type="primary" round>Primary</el-button>
                    <el-button type="success" round>Success</el-button>
                    <el-button type="info" round>Info</el-button>
                    <el-button type="warning" round>Warning</el-button>
                    <el-button type="danger" round>Danger</el-button>
                </div>

                <div>
                    <el-button :icon="Search" circle />
                    <el-button type="primary" :icon="Edit" circle />
                    <el-button type="success" :icon="Check" circle />
                    <el-button type="info" :icon="Message" circle />
                    <el-button type="warning" :icon="Star" circle />
                    <el-button type="danger" :icon="Delete" circle />
                </div>
            </div>
        </div>
        <div>
            <GlassCard class="container">
                1
            </GlassCard>

            <GlassCard shadow="hover" class="container">
                1
            </GlassCard>
            <GlassCard shadow="never" class="container">
                1
            </GlassCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import GlassButton from '@/components/Common/GlassButton.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'

</script>

<style lang="scss" scoped>
.container {
    margin: 2em;

    .mb-4 {
        margin-bottom: 1em;
    }
}
</style>
