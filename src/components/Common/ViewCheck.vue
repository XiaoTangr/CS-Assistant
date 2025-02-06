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
                        <el-button plain type="warning" size="small"  @click="confirm">继续使用</el-button>
                    </div>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { WarningFilled } from "@element-plus/icons-vue"
import { ref } from 'vue';

const ignoreOption = ref(false);
const maskDisplay = ref(true);

const closeMask = () => {
    if (ignoreOption) {
        // TODO: disable this option in settings.db
    }
    maskDisplay.value = false;
}
</script>

<style scoped lang="scss">
.disabled {
    display: none !important;
}

.Meida-masker {
    z-index: 9 !important;
    backdrop-filter: blur(calc($windouwTitle-Blur / 10));
    position: absolute;
    top: 32px;
    width: 100%;
    height: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24px;
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