<template>
    <div>
        <div class="MainMenu">
            一级菜单
        </div>
        <div class="SubMenu">
            <SubMenu>
                <slot></slot>
            </SubMenu>
        </div>
    </div>
</template>

<script setup lang="ts">
import SubMenu from './SubMenu.vue';


</script>

<style scoped></style>