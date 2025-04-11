<template>
    <div class="container">
        <el-card class="card">
            <template #header>
                <div class="header">
                    <Bell class="icon" />
                    <div class="text"> 公告 </div>
                </div>
            </template>
            <template #default>
                <div class="default">
                    <el-text v-html="data[0].publishContent" line-clamp="5" />
                </div>
            </template>
            <template #footer>
                <div class="footer">
                    <div class="publish-data">
                        {{ data[0].publishDate }}
                    </div>
                    <div class="read-more">
                        <el-link type="warning">历史公告</el-link>
                    </div>
                </div>
            </template>
        </el-card>
    </div>

</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus';

const data = ref<Array<notice>>([
    {
        publishDate: '',
        publishContent: ''
    }
])

onMounted(() => {
    axios.get(
        "https://cdn.jsdelivr.net/gh/XiaoTangr/CS2H_Data/Notice.json"
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
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;

    .card {
        width: 80%;
        /* 卡片宽度100% */
        position: absolute;


        .header {
            display: flex;
            justify-content: left;
            align-items: center;

            .icon {
                height: $font-size;
            }

            .text {
                padding: 0 $globe-padding ;
            }

        }


        .default {
            flex: 1;
        }

        .footer {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }


}
</style>