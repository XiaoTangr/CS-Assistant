<template>
    <div v-if="isMaskNeedShow" class="Meida-masker">
        <p> 不推荐使用低于800*400的分辨率运行此程序! </p> <br>
        <div class="option">
            <el-popconfirm icon-color="#fd6458" :icon="WarningFilled" width="16em" title="较小窗口可能出现显示异常!"
                @confirm="closeMask">
                <template #reference>
                    <el-button plain type="warning"> 继续使用 </el-button>
                </template>
                <template #actions="{ confirm }">
                    <div class="btn-container">
                        <el-checkbox v-model="disableSettings" size="small">不再提示</el-checkbox>
                        <el-button plain type="warning" size="small" @click="confirm">忽略本次</el-button>
                    </div>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store/SettingsStore";
import { WarningFilled } from "@element-plus/icons-vue"
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';



const SettingsStore = useSettingsStore();
const { data } = storeToRefs(SettingsStore)

const viewportHeight = ref(0);
const viewportWidth = ref(0);

// 数据库数据
const showViewCheckData = ref()

// 遮罩层状态
const isMaskNeedShow = computed(() => {
    return showViewCheckData.value?.selected && (viewportHeight.value < 600 || viewportWidth.value < 800)
})
// 不再提示
const disableSettings = ref(false);
// 设置中是否禁用
const neverCheck = ref(false);

watch(data, () => {
    showViewCheckData.value = data.value.find((item) => item.key == "showViewCheck");
    neverCheck.value = !showViewCheckData.value.selected;
})

const closeMask = () => {
    showViewCheckData.value!.selected = false;
    if (disableSettings.value) {
        SettingsStore.saveRow(showViewCheckData.value!);
    }
    disableSettings.value = false;
}


const getWindowSize = () => {
    viewportHeight.value = document.body.clientHeight;
    viewportWidth.value = document.body.clientWidth;
}
onMounted(() => {
    getWindowSize();
    window.addEventListener('resize', getWindowSize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', getWindowSize);
});
</script>

<style scoped lang="scss">

.Meida-masker {
    z-index: 10 !important;
    backdrop-filter: blur(calc($header-bar-Blur * 2));
    position: absolute;
    top: $header-bar-height;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: $font-size;
    color: $font-color;
    text-align: center;
    justify-content: center;
}

.btn-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

@media screen and (min-width: 800px) and (min-height: 400px) {
    .Meida-masker {
        display: none;
    }
}
</style>