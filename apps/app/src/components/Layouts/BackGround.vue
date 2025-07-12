<template>
    <div class="bg"></div>
</template>

<script setup lang="ts">
// TODO
</script>

<style scoped lang="scss">
.bg {
    position:fixed;
    z-index: -99;
    width: 100vw;
    height: 100vh;
    background: url('@/assets/imgs/bg.png');
    background-repeat: no-repeat; // 不重复图片
    background-position: center center; // 图片居中
    background-size: cover; // 图片覆盖整个容器，可能会裁剪图片的某些部分
    // background-color: #f5f5f563;

}
</style>