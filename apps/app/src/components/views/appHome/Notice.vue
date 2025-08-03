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
                    <CommSpace direction="vertical" :size="4">
                        <el-text v-html="activity.publishContent" truncated line-clamp="2" />
                        <el-link type="primary" @click="setIndex(index)">详情</el-link>
                    </CommSpace>
                </el-timeline-item>
            </el-timeline>
        </template>
    </GlassCard>
    <GlassDialog :draggable="true" width="400" align-center v-model="isShow" @closed="showDetail = -1">
        <template #header>
            <div class="Notice-dialog-header">
                {{ NoticeDetail?.publishTitle }}
            </div>
        </template>
        <p v-html="NoticeDetail?.publishContent" />
        <template #footer>
            <el-text>
                {{ NoticeDetail?.publishDate }}
            </el-text>
        </template>
    </GlassDialog>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { Notice } from '@/core/models';
import CommSpace from '@/components/Common/CommSpace.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import { LogServices } from '@/core/services';
import GlassDialog from '@/components/Common/GlassDialog.vue';
import { ApiService } from '@/core/api';
const data = ref<Array<Notice> | null>();


const showDetail = ref(-1)

const isShow = computed(() => showDetail.value >= 0)

const NoticeDetail = computed(() => {
    return data.value?.[showDetail.value]
})

const setIndex = (index: number) => {
    LogServices.error('setIndex', index)
    showDetail.value = index
}

onMounted(async () => {
    data.value = (await ApiService.getNotice()).data;
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

.Notice-dialog-header {
    font-weight: bold;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
