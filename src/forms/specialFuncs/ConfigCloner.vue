<template>
    <div class="container">
        <div class="logined-steam-users-container item">
            <LoginedSteamUsers />
        </div>
        <div class="config-cloner-container item">
            <ConfigCloner />
        </div>
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
        margin: calc($globe-margin /2);
    }

}
</style>