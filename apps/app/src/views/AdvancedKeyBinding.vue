<template>
    <div>
        背景色选择器
        <el-color-picker v-model="bgcolor" show-alpha />
        <el-input v-model="bgcolor" /> <br>
        常规文本颜色选择器
        <el-color-picker v-model="normaltext" show-alpha />
        <el-input v-model="normaltext" /> <br>

        高亮文本颜色选择器
        <el-color-picker v-model="highlighttext" show-alpha />
        <el-input v-model="highlighttext" /><br>


        <div class="bg" :style="['background-color:' + bgcolor]">
            <div class="normaltext" :style="['color:' + normaltext]">
                常规文本
            </div>

            <div class="highlighttext" :style="['color:' + highlighttext]">
                高亮文本
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const bgcolor = ref('rgba(49, 49, 49, 1)'); // 默认背景色
const normaltext = ref('rgba(215, 215, 215, 1)');
const highlighttext = ref('rgba(250, 250, 250, 1)');
</script>

<style lang="scss" scoped>
.bg {
    height: 15em;
    width: 15em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
