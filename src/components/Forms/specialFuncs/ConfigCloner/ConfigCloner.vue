<template>
    <el-card class="container">
        <template #header> 配置文件克隆器 </template>
        <template #default>
        
        
        
        </template>
    </el-card>
</template>

<script setup lang="ts">
import { useLoginedSteamUserStore } from '@/store/LoginedSteamUserStore';
import { storeToRefs } from 'pinia';



const LoginedSteamUserStore = useLoginedSteamUserStore();

const { data } = storeToRefs(LoginedSteamUserStore);

</script>

<style scoped></style>