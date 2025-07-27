<template>
    <GlassCard shadow="never" class="container" headerClass="header" bodyClass="body">
        <template #header>

            <Bell class="icon" />
            <div class="text">公告</div>
        </template>
        <template #default>
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in data" :key="index" :timestamp="activity.publishDate"
                    placement="top">
                    <CommSpace :size="4">
                        <el-text v-html="activity.publishContent" truncated line-clamp="2" />
                        <el-link type="primary">详情</el-link>
                    </CommSpace>
                </el-timeline-item>
            </el-timeline>
        </template>

    </GlassCard>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { useSettingsStore } from '@/store/SettingsStore';
import { Notice } from '@/core/models';
import CommSpace from '@/components/Common/CommSpace.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
const SettingsStore = useSettingsStore();
const data = ref<Array<Notice>>([
    {
        publishDate: '',
        publishContent: ''
    }
])

onMounted(() => {
    const baseUrl = SettingsStore.getDbDataItemByKey('remoteUrlPrefix')?.selected;
    axios.get(
        `${baseUrl}/Notice.json`
    ).then((res) => {
        data.value = res.data
    }).catch((e) => {
        ElNotification.error(e.toString())
    })
})


</script>

<style scoped lang="scss">
.container {
    display: flex;

    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;

    :deep(.header) {
        padding: $globe-padding;

        z-index: 1;
        display: flex !important;
        justify-content: left;
        align-items: center;

        .icon {
            height: 1em;
        }

        .text {
            padding-left: .5em;
        }
    }

    :deep(.body) {
        padding: $globe-padding !important;
        overflow-y: auto;
    }
}
</style>
