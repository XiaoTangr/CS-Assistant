<template>
    <div v-if="isMaskNeedShow" class="Meida-masker">
        <p> 不推荐使用低于800*400的分辨率运行此程序! </p> <br>
        <div class="option">
            <el-popconfirm icon-color="#fd6458" :icon="WarningFilled" width="16em" title="较小窗口可能出现显示异常!"
                @confirm="closeMask">
                <template #reference>
                    <el-button plain type="warning">
                        忽略
                    </el-button>
                </template>
                <template #actions="{ confirm }">
                    <div class="btn-container">
                        <el-checkbox v-model="isChecked" size="small">不再提示</el-checkbox>
                        <el-button plain type="warning" size="small" @click="confirm">{{ isChecked ? "确定" : "忽略本次"
                            }}</el-button>
                    </div>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Settings } from "@/models/Settings.model";
import { useSettingsStore } from "@/store/SettingsStore";
import { WarningFilled } from "@element-plus/icons-vue"
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const SettingsStore = useSettingsStore();
const viewportHeight = ref(0);
const viewportWidth = ref(0);
const dataFromDB = ref<Settings | any>();
// 遮罩层状态
const isMaskNeedShow = computed(() => {
    return dataFromDB.value?.selected && (viewportHeight.value < 600 || viewportWidth.value < 800)
})
const isChecked = ref(false);

const closeMask = async () => {
    dataFromDB.value.selected = false;

    if (isChecked.value) {
        // await SettingsStore.updateModifedSetting(dataFromDB.value);
    }
}
const getWindowSize = () => {
    viewportHeight.value = document.body.clientHeight;
    viewportWidth.value = document.body.clientWidth;
}
watch(SettingsStore, () => {
    dataFromDB.value = SettingsStore.qetSettingsByKey("showViewCheck");
})
onMounted(async () => {
    getWindowSize();
    window.addEventListener('resize', getWindowSize);
    dataFromDB.value = SettingsStore.qetSettingsByKey("showViewCheck")
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', getWindowSize);
});
</script>

<style scoped lang="scss">
.Meida-masker {
    z-index: 1000 !important;
    backdrop-filter: blur(calc($simpe-blur * 2));
    position: absolute;
    top: 0;
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