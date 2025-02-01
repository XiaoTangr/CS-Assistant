<template>
  <div class="App-Container">
    <WindowTitle />
    <div class="Main">
      <div class="Menu">
        <MainMenu>
          <div class="Content">
            <router-view />
          </div>
        </MainMenu>
      </div>

    </div>
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