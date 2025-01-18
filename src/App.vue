<template>
  <div class="App-Container">
    <TitleBar />
    <MainBar />
  </div>
</template>
<script setup lang="ts">
import MainBar from './Components/Common/MainBar.vue';
import TitleBar from './Components/Common/TitleBar.vue';


</script>
<style scoped>
.App-Container {
  height: 100%;
  width: 100%;
  
}
</style>