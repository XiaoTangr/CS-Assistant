<template>
    <div class="container">
        <CommSpace class="s" direction="horizontal">
            <PageRouter />
            <WindowDrager />
        </CommSpace>
        <CommSpace class="m" direction="horizontal">
            <el-text>软件迭代中,不代表最终品质!</el-text>
        </CommSpace>
        <CommSpace class="e" direction="horizontal">
            <AppUpdater />
            <TopBacker />
        </CommSpace>
    </div>

</template>

<script setup lang="ts">
import CommSpace from '../Common/CommSpace.vue';
import AppUpdater from './GlobalCommand/AppUpdater.vue';
import PageRouter from './GlobalCommand/PageRouter.vue';
import TopBacker from './GlobalCommand/TopBacker.vue';
import WindowDrager from './GlobalCommand/WindowDrager.vue';
</script>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: $global-command-height;
    padding: $global-command-padding 0;
    padding-right: $globe-padding;


    &>* {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .m {
        flex: 1;
    }
}
</style>
