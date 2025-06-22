<template>
  <div class="App-Container" @contextmenu.prevent="openMenu()">
    <div class="nav-container">
      <NavBar />
    </div>
    <div class="window-container">
      <div class="global-command-container">
        <GlobalCommand />
      </div>
      <div class="content-container">
        <RouterView />
      </div>
    </div>
    <ViewCheck />
    <BackGround />
  </div>

</template>
<script setup lang="ts">
import BackGround from './components/Layouts/BackGround.vue';
import NavBar from './components/Layouts/NavBar.vue';
import ViewCheck from './components/Layouts/ViewCheck.vue';
import GlobalCommand from './components/Public/GlobalCommand.vue';
const openMenu = () => {
  console.warn('User try open contextmenu!')
}

</script>

<style lang="scss" scoped>
.App-Container::before {
  z-index: 2;
  content: "";
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5em;
  backdrop-filter: blur(10em);
  -webkit-backdrop-filter: blur(10em);
  mask: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.5) 10%,
      rgba(0, 0, 0, 0) 100%);
  // -webkit-app-region: drag;
}

.App-Container {
  height: 100vh;
  width: 100vw;
  display: flex;
  border: $simple-border;

  .nav-container {
    height: 100vh;
    width: 20em;
  }

  .window-container {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    background: rgb(250, 250, 250);

    .global-command-container {
      z-index: 9;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      padding: $globe-padding ;
      padding-left: 0;
    }

    .content-container {
      padding: $globe-padding;
      padding-left: 0;
      padding-top: 0;
      overflow-y: auto;
    }
  }


}
</style>