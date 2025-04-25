<template>
    <div class="container">
        <div class="top">
            <div class="tl">
                <GameCheck />
            </div>
            <div class="tr">
                <Notice />
            </div>
        </div>
        <div class="bottom">
            <LoginedSteamUsers />
        </div>
    </div>
</template>

<script setup lang="ts">
import Notice from '@/components/Common/Notice.vue';
import GameCheck from '@/components/Forms/appHome/GameCheck.vue';
import LoginedSteamUsers from '@/components/Public/LoginedSteamUsers.vue';
</script>
<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .top {
        display: flex;
        width: 100%;
        flex-direction: row;
        flex: 3;

        .tl {
            margin: calc($globe-margin / 2);
            flex-grow: 1;
        }

        .tr {
            margin: calc($globe-margin / 2);
            width: 40%;
        }
    }

    .bottom {
        margin: calc($globe-margin / 2);
        flex: 2;
    }
}
</style>