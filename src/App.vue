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
import BackGround from './components/Common/BackGround.vue';
import { onMounted } from 'vue';
import { DBinstall } from './DBA/Utils/DbInstall';


const openMenu = () => {
  console.warn('User try open contextmenu!')

}

onMounted(async () => {
    DBinstall();
})

</script>

<style lang="scss">
.App-Container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .layouts {
    z-index: 1;
    height: 100%;
    width: 100%;
    background: $globe-layout-color;
    display: flex;
    flex-direction: column;

    .header {
      z-index: 999;
      height: $header-bar-height;
    }

    .content {
      z-index: 2;
      // overflow: hidden;
      flex: 1;
      padding: $globe-padding;
      display: block;
      height: calc(100% - $header-bar-height - $status-bar-height);
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