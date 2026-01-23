<template>
    <div v-if="isMaskNeedShow" class="Meida-masker">
        <CommSpace class="container" :fill-ratio="100" fill direction="vertical">
            <div class="msg">
                <el-icon>
                    <WarningFilled />
                </el-icon>
                <span>较小窗口可能出现显示异常!</span>
            </div>
            <div class="operate">
                <CommSpace direction="horizontal">
                    <el-checkbox v-model="isChecked" size="small">不再提示</el-checkbox>
                    <GlassButton round type="warning" size="small" @click="closeMask">
                        {{ isChecked ? "确认关闭" : "忽略本次" }}
                    </GlassButton>
                </CommSpace>
            </div>
        </CommSpace>

    </div>
</template>

<script setup lang="ts">
import { WarningFilled } from "@element-plus/icons-vue"
import { AppConfig, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import CommSpace from "../Common/CommSpace.vue";
import GlassButton from "../Common/GlassButton.vue";
import { useAppConfigStore } from "@/store";

const appConfigStore = useAppConfigStore();
const viewportHeight = ref(0);
const viewportWidth = ref(0);
const dataFromDB = ref<AppConfig | any>();
// 遮罩层状态
const isMaskNeedShow = computed(() => {
    return dataFromDB.value?.selected && (viewportHeight.value < 600 || viewportWidth.value < 800)
})
const isChecked = ref(false);

const closeMask = async () => {
    dataFromDB.value.selected = false;

    if (isChecked.value) {
        await appConfigStore.saveAppConfig(dataFromDB.value).then(
            async () => {
                await appConfigStore.fetchData()
            }
        );
    }
}
const getWindowSize = () => {
    viewportHeight.value = document.body.clientHeight;
    viewportWidth.value = document.body.clientWidth;
}
watch(appConfigStore, () => {
    dataFromDB.value = appConfigStore.getDbAppConfig("showViewCheck");
})
onMounted(async () => {
    getWindowSize();
    window.addEventListener('resize', getWindowSize);
    dataFromDB.value = appConfigStore.getDbAppConfig("showViewCheck")
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', getWindowSize);
});
</script>

<style scoped lang="scss">
.Meida-masker {
    background-color: $globe-layout-color;
    backdrop-filter: $simpe-blur;
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;


        .msg {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .operate {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

}



@media screen and (min-width: 800px) and (min-height: 400px) {
    .Meida-masker {
        display: none;
    }
}
</style>
