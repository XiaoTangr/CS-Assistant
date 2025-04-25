<template>
    <div class="container">
        <el-card style="display:flex;flex-direction:column;flex: 1;" :body-style="{ flex: 1 }">
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
import { useSettingsStore } from '@/store/SettingsStore';
const SettingsStore = useSettingsStore();
const data = ref<Array<notice>>([
    {
        publishDate: '',
        publishContent: ''
    }
])

onMounted(() => {
    const baseUrl = SettingsStore.getDataByKeyName('remoteUrlPrefix').value?.selected;
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

    .header {
        display: flex;
        justify-content: left;
        align-items: center;

        .icon {
            height: 100%;
        }

        .text {
            padding: 0 $globe-padding ;
        }

    }

    .default {
        width: 100%;
        height: 100%;
        flex: 1;
    }

    .footer {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
}
</style>
