<template>
    <div class="container" id="side-bar-container">
        <el-tooltip effect="light" v-for="value in routesConfig" :key="value.name" :content="(value.meta as any)?.title"
            placement="right">
            <GlassButton :id="value.name" plain v-if="isInDevMode || value.name !== 'devTools'"
                :shadow="activeRouterName === value.name ? 'always' : 'hover'"
                :type="activeRouterName === value.name ? 'primary' : 'default'" 
                @click="switchRouteHandler(value.name as string)"
                size="large" circle :icon="value.meta?.icon" class="router-btn" />
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">
import { routesConfig } from '@/core/config/routes-config';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isInDevMode = ref(false);

const activeRouterName = ref('appHome');

watch(() => route.name, (newVal) => {
    activeRouterName.value = newVal as string;
});

onMounted(async () => {
    isInDevMode.value = false;
    // isInDevMode.value = (await KeyValueService.getInstance().getValue("devMode"))?.value as boolean || false;
});

/**
 * 切换路由
 * @param routeName 路由名称
 */
const switchRouteHandler = (routeName: string) => {
    router.push({ name: routeName });
}


</script>

<style scoped lang="scss">
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .router-btn {
        margin: .25rem 0;
    }

    // 设置按钮
    #About {
        margin-top: auto;
    }
}
</style>