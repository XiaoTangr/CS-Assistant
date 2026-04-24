<template>
  <el-scrollbar class="container" id="app-container">
    <header id="sys-header" class="header">
      <AppHeader></AppHeader>
    </header>

    <main id="sys-main" class="main">
      <router-view>
      </router-view>
    </main>
  </el-scrollbar>

</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';

</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  .header {
    width: 100%;
    position: sticky;
    top: 0;

    .menu {
      background-color: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(1rem);

      .el-sub-menu:last-child {
        margin-right: 1rem;
      }

      .el-menu-item:nth-child(1) {
        margin-left: 1rem;
        margin-right: auto;
      }
    }
  }

  .main {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .post-list {
      width: 80%;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .post-item {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 16px 0px rgba(0, 0, 0, 0.1);

        .post-title {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .post-content {
          font-size: 1rem;
          color: #333;
        }

        .post-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

      }
    }
  }
}
</style>