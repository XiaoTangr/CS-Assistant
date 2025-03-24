<template>
    <div class="container">
        <div class="top">
            <div class="tl">tl</div>
            <div class="tr">
                <Notice />
            </div>
        </div>
        <div class="bottom">
            bot
        </div>
    </div>
</template>

<script setup lang="ts">
import Notice from '@/components/Common/Notice.vue';

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
            flex-grow: 1;
        }

        .tr {
            width: 40%;
        }
    }

    .bottom {
        flex: 2;
    }
}
</style>