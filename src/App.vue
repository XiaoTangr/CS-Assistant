<template>
  <div class="App-Container" @contextmenu.prevent="openMenu()">
    <div class="funcs">
      <BackGround />
    </div>
    <div class="layouts">
      <div class="header">
        <HeaderBar />
      </div>
      <div class="content">
        <ContentBar />
      </div>
      <div class="status">
        <StatusBar />
      </div>
    </div>

  </div>

</template>
<script setup lang="ts">
import HeaderBar from './components/Layouts/HeaderBar.vue';
import ContentBar from './components/Layouts/ContentBar.vue';
import StatusBar from './components/Layouts/StatusBar.vue';
import BackGround from './components/Layouts/BackGround.vue';

const openMenu = () => {
  console.warn('User try open contextmenu!')
}

</script>

<style lang="scss">
.App-Container {
  font-size: $font-size;

  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;

  .layouts {
    z-index: 1;
    height: 100%;
    width: 100%;
    background: $globe-layout-color;

    .header {
      z-index: 999;
      height: $header-bar-height;
    }

    .content {
      z-index: 2;
      // overflow: hidden;
      padding: $globe-padding;
      display: block;
      height: $content-bar-height;
    }

    .status {
      z-index: 1;
      height: $status-bar-height;
    }
  }

  .funcs {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
  }
}
</style>
