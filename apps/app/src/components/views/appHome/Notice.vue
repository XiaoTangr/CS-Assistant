<template>
    <GlassCard shadow="never" class="container" headerClass="notice-header" bodyClass="notice-body">
        <template #header>
            <Bell class="icon" />
            <div class="text">公告</div>
        </template>
        <template #default>
            <el-timeline>
                <el-timeline-item class="timeline" v-for="(activity, index) in data" :key="index" placement="top"
                    :timestamp="activity.publishDate?.toString()">
                    <CommSpace direction="vertical" :size="4">
                        <el-text line-clamp="2" v-html="htmlGenerater(activity.publishContent as string)" />
                        <el-link type="primary" @click="setIndex(index)">详情</el-link>
                    </CommSpace>
                </el-timeline-item>
            </el-timeline>
            <GlassDialog :draggable="true" width="400" align-center v-model="isShow" @closed="showDetail = -1">
                <template #header>
                    <div class="Notice-dialog-header">
                        {{ NoticeDetail?.publishTitle }}
                    </div>
                </template>
                <el-text v-html="htmlGenerater(NoticeDetail?.publishContent as string)" />
                <template #footer>
                    <el-text>
                        {{ NoticeDetail?.publishDate }}
                    </el-text>
                </template>
            </GlassDialog>
        </template>
    </GlassCard>

</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';
import { Notice } from '@/core/models';
import CommSpace from '@/components/Common/CommSpace.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import { LogService } from '@/core/services';
import GlassDialog from '@/components/Common/GlassDialog.vue';
import { ApiService } from '@/core/api';
const data = ref<Notice[] | null>(null);;


const showDetail = ref(-1)

const isShow = computed(() => showDetail.value >= 0)

const NoticeDetail = computed(() => {
    return data.value?.[showDetail.value]
})

const setIndex = (index: number) => {
    LogService.debug('setIndex', index)
    showDetail.value = index
}

/**
 * 将字符串转为html
 * @param string 目标字符串
 */
const htmlGenerater = (string: string) => {
    if (!string) return '';
    return string
        .replace(/\n/g, '<br/>')
        .replace(/\r\n/g, '<br/>');
};

onMounted(async () => {
    data.value = (await ApiService.getNotice()).data ?? null;
})


</script>

<style scoped lang="scss">
.container {

    width: 100%;
    height: 100%;
    padding: 0;

    :deep(.notice-header) {
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

    :deep(.notice-body) {
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

.timeline {
    overflow-x: hidden;
}
</style>
