<template>

    <CommSpace fill direction="vertical" :fill-ratio="100" class="container">
        <div class="container-item top">
            <GameCheck class="game-check" />
            <Notice class="notice" />
        </div>
        <LoginedSteamUsers class="container-item bottom" />
    </CommSpace>
    <!-- <div class="container">

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
    </div> -->
</template>

<script setup lang="ts">
import Notice from '@/components/views/appHome/Notice.vue';
import GameCheck from '@/components/views/appHome/GameCheck.vue';
import LoginedSteamUsers from '@/components/Public/LoginedSteamUsers.vue';
import CommSpace from '@/components/Common/CommSpace.vue';
</script>
<style scoped lang="scss">
.container {
    .container-item {
        width: 100%;
    }

    .top {
        display: flex;
        height: 20em;
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

// .container {
//     width: 100%;
//     // height: $content-fill-hight;

//     .ot {
//         display: flex;
//         width: 100%;
//         margin-bottom: $globe-margin;

//         .il,
//         .ir {
//             height: 20em;
//         }

//         .il {
//             width: 70%;

//             margin-right: $globe-margin;
//         }

//         .ir {
//             width: 30%;

//         }
//     }

//     .ob {
//         width: 100%;
//     }


// }</style>
