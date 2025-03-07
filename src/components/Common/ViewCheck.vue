<template>
    <div class="Meida-masker" :class="{ disabled: maskDisplay === false }">
        <p>
            不推荐使用低于800*400的分辨率运行此程序!
        </p>
        <div class="option">
            <el-popconfirm icon-color="#fd6458" :icon="WarningFilled" width="16em" title="较小窗口可能出现显示异常!"
                @confirm="closeMask">
                <template #reference>
                    <el-button plain type="warning"> 继续使用 </el-button>
                </template>
                <template #actions="{ confirm }">
                    <div class="btn-container">
                        <el-checkbox v-model="ignoreOption" size="small">不再提示</el-checkbox>
                        <el-button plain type="warning" size="small" @click="confirm">继续使用</el-button>
                    </div>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/store/SettingsStore";
import { WarningFilled } from "@element-plus/icons-vue"
import { onMounted, ref, watchEffect } from 'vue';
const SettingsStore = useSettingsStore();

const ignoreOption = ref(false);
const maskDisplay = ref(true);

const data = ref();

const closeMask = () => {
    data.value.selected = ignoreOption.value == true ? "false" : "true";
    console.log(data.value);
    SettingsStore.saveRow(data.value);
    maskDisplay.value = false;
}
onMounted(async () => {
    await SettingsStore.fetchData();
    data.value = SettingsStore.getDataByKeyName("showViewCheck")[0]
    console.log(data.value);
    maskDisplay.value = data.value.selected
})

</script>

<style scoped lang="scss">
.disabled {
    display: none !important;
}

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
    justify-content: space-around;
}

.btn-container {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

@media screen and (min-width: 800px) and (min-height: 400px) {

    .Meida-masker {
        display: none;
    }
}
</style>