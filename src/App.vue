<template>
  <div class="App-Container">

    <WindowTitle />
    <MainMenu />
    <RouterView />

    <router-view name="content">
      <RouterView />
    </router-view>
  </div>
</template>
<script setup lang="ts">
import WindowTitle from './components/Common/WindowTitle.vue';
import MainMenu from './components/MainMenu.vue';
</script>
<style scoped>
.App-Container {
  height: 100%;
  width: 100%;

}
</style>