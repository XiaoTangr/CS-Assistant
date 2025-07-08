<template>
    <el-card class="container" style="display:flex;flex-direction:column;flex: 1;"
        :body-style="{ flex: 1, 'overflow-y': 'auto', padding: '0' }">

        <div class="header liquid-card">
            <Bell class="icon" />
            <div class="text">公告</div>
        </div>
        <el-timeline class="body">
            <el-timeline-item v-for="(activity, index) in data" :key="index" :timestamp="activity.publishDate"
                placement="top">
                <CommSpace :size="4">
                    <el-text v-html="activity.publishContent" truncated line-clamp="2" />
                    <el-link type="primary">详情</el-link>
                </CommSpace>
            </el-timeline-item>
        </el-timeline>
    </el-card>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { useSettingsStore } from '@/store/SettingsStore';
import { Notice } from '@/core/types/types';
import CommSpace from '@/components/Common/CommSpace.vue';
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

    .header,
    .body {
        padding: .5em 1em;
    }


    .header {
        z-index: 100;
        position: sticky;
        top: 0;
        display: flex;
        justify-content: left;
        align-items: center;

        .icon {
            height: 1em;
        }

        .text {
            padding-left: .5em;
        }
    }

}
</style>
