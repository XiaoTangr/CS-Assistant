<template>
  <div class="App-Container" @contextmenu.prevent="openMenu()">
    <WindowTitle />
    <div class="Main-Container">
      <div class="Menu-Container">
        <MainMenu />
        <RouterView />
      </div>
      <div class="Content-Container">
        <router-view name="content">
          <RouterView />
        </router-view>
      </div>
    </div>
  </div>
  <BackGround />
</template>
<script setup lang="ts">
import WindowTitle from './components/Common/WindowTitle.vue';
import MainMenu from './components/MainMenu.vue';
import BackGround from './components/Common/BackGround.vue';
const openMenu = () => {
  console.warn('contextmenu')
}
</script>

<style lang="scss">
.App-Container {
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .Main-Container {
    display: flex;
    height: calc(100% - 32px - 2em);
    margin: 1em;

    .Menu-Container {
      border-radius: 4px;
      display: flex;
      width: 15em;
      backdrop-filter: blur($MenuContainer-Blur);
      border: $simple-border;
      box-shadow: $menu-box-shadow;
    }

    .Content-Container {
      margin-left: 1em;
      padding: .5em;
      flex: 1;
      height: 100%;
      overflow: auto;
      border: $simple-border;
      border-radius: 4px;
    }
  }
}
</style>