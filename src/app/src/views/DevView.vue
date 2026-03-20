<template>
    <div class="container">
        <GlassButton @click="test">
            测试
        </GlassButton>
        <!-- <div v-for="item in 100" :key="item">
            {{ item }}
        </div> -->
    </div>
</template>

<script setup lang="ts">
import keyValueData from '@/core/data/keyvalue-data';
import logService from '@/core/service/log-service';


const test = async () => {
    let key = 'testkey1';
    let value = 'testvalue';
    let res = await keyValueData.setValue(key, value);
    logService.debug(res);
    let res2 = await keyValueData.getValue(key);
    logService.debug(res2);
};
</script>

<style scoped lang="scss">
.container {
    // background-color: red;
}
</style>