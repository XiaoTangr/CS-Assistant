<template>
    <div class="container">
        <el-card>
            <div class="title">
                <Bell />
                <p>公告</p>
            </div>
            <div class="context">
                
                注意： 使用 position: absolute 会使元素相对于其最近的定位祖先元素（即 position 属性不为 static
                的祖先元素）进行绝对定位。如果没有这样的祖先元素，则相对于初始包含块（通常是视口）。
            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';

</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    width: 200px;

    .title {
        display: flex;
    }
}
</style>