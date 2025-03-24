import { RouteRecordRaw } from 'vue-router'

export const DevToolsRoutesCfg: RouteRecordRaw =
{
    path: '/devTools',
    redirect: "/devTools/devTools",
    meta: {
        icon: null,
        text: "开发者工具"
    },
    components: {
        default: () => import('@/components/Menu/SubMenu.vue'),
        content: () => import('../../forms/DevTools/DevTools.vue')
    },
    children: [
        {
            path: '/devTools/devTools',
            meta: {
                icon: null,
                text: "开发者工具"
            },
            component: () => import('../../forms/DevTools/DevTools.vue')
        }]
}