<template>
    <div class="post-list">
        <div v-for="(item, idx) in postList" :key="idx" class="post-item">
            <h4 class="post-title">{{ item.title }}</h4>
            <div class="post-content" v-html="item.content"> </div>
            <div class="post-info">
                <el-text>
                    @ {{ item.author?.nickname || item.author?.username }}
                </el-text>
                &nbsp;
                <el-text> {{ item.createTime }}</el-text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PageResult } from '@/types/apiResponse';
import type { BizPostDetailDTO, bizPostQueryParams } from '@/types/bizPost.types';
import http from '@/util/http/request';
import { computed, onMounted, reactive, ref } from 'vue'
const bizPostData = ref<PageResult<BizPostDetailDTO>>()
const postList = computed(() => bizPostData.value?.records)

onMounted(async () => {
    await fetchPostList();
})

const listRequestParams = reactive<bizPostQueryParams>({
    page: 1,
    size: 20,
})



const fetchPostList = async () => {
    await http.get('/api/v1/post', listRequestParams, {
        withToken: false
    }).then((res) => {
        bizPostData.value = res.data
    })
        .catch((err) => {
            console.error(err)
        })
}
</script>

<style scoped lang="scss">
.post-list {
    width: 80%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .post-item {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 16px 0px rgba(0, 0, 0, 0.1);

        .post-title {
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
            font-weight: bold;
        }

        .post-content {
            font-size: 1rem;
            color: #333;
        }

        .post-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

    }
}
</style>