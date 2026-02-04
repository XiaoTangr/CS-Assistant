<template>
    <div class="container">
        <div v-for="item in 100" :key="item">
            {{ item }}
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.container {
    // background-color: red;
}
</style>