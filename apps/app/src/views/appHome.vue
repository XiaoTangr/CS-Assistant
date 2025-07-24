<template>
    <div class="container">
        <div class="ot">
            <div class="il">
                <GameCheck />
            </div>
            <div class="ir">
                <Notice />
            </div>
        </div>
        <div class="ob">
            <LoginedSteamUsers />
        </div>
    </div>
</template>

<script setup lang="ts">
import Notice from '@/components/views/appHome/Notice.vue';
import GameCheck from '@/components/views/appHome/GameCheck.vue';
import LoginedSteamUsers from '@/components/Public/LoginedSteamUsers.vue';
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;

    .ot {
        display: flex;
        width: 100%;
        margin-bottom: $globe-margin;

        .il,
        .ir {
            height: 20em;
        }

        .il {
            width: 70%;

            margin-right: $globe-margin;
        }

        .ir {
            width: 30%;

        }
    }

    .ob {
        width: 100%;
    }


}
</style>