<template>
    <div class="container">
        <div class="item">
            <GameCheck class="inner-item gc" />
            <Notice class="inner-item nt" />
        </div>
        <div class="item">
            <!-- <LoginedSteamUsers class="inner-item" /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import Notice from '@/components/views/appHome/Notice.vue';
import GameCheck from '@/components/views/appHome/GameCheck.vue';
</script>
<style scoped lang="scss">
.container {
    .item {
        display: flex;
        width: 100%;
        flex-direction: row;
        margin-bottom: $globe-margin;

        .inner-item {
            flex: 1;
            position: relative;
            margin-right: $globe-margin;
        }


        .inner-item:last-child {
            margin-right: 0;
        }

        .gc {
            flex: 2;
        }

        .nt {
            flex: 1;
        }
    }

    .item:last-child {
        margin-bottom: 0;
    }
}
</style>