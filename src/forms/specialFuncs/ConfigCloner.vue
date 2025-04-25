<template>
    <div class="container">
        <LoginedSteamUsers class="logined-steam-users-container item" />
        <ConfigCloner class="config-cloner-container item" />
        <el-card></el-card>
    </div>
</template>

<script setup lang="ts">
import ConfigCloner from '@/components/Forms/specialFuncs/ConfigCloner/ConfigCloner.vue';
import LoginedSteamUsers from '@/components/Public/LoginedSteamUsers.vue';


</script>

<style scoped lang="scss">
.container {

    .item {
        overflow-y: auto;
        margin-bottom: $globe-margin;
    }

    .item:last-child {
        margin-bottom: 0;
    }
}
</style>