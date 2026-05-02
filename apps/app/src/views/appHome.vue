<template>

    <CommSpace fill direction="vertical" :fill-ratio="100" class="container">
        <div class="container-item top">
            <GameCheck class="game-check" />
            <Notice class="notice" />
        </div>
        <LoginedSteamUsers class="container-item bottom" />
    </CommSpace>
</template>

<script setup lang="ts">
import Notice from '@/components/views/appHome/Notice.vue';
import GameCheck from '@/components/views/appHome/GameCheck.vue';
import LoginedSteamUsers from '@/components/Public/LoginedSteamUsers.vue';
import CommSpace from '@/components/Common/CommSpace.vue';
</script>
<style scoped lang="scss">
.container {
    width: 100%;

    .container-item {
        width: 100%;
    }

    .top {
        display: flex;
        height: 20rem;
        width: 100%;

        .game-check {
            flex: 2;
            margin-right: $globe-margin;
        }

        .notice {
            flex: 1;
        }
    }
}
</style>
