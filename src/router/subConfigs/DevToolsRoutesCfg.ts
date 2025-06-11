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
        content: () => import('../../views/DevTools/DevTools.vue')
    },
    children: [
        {
            path: '/devTools/DbRender',
            meta: {
                icon: null,
                text: "开发者工具"
            },
            component: () => import('../../views/DevTools/DevTools.vue')
        }, {
            path: '/devTools/devTools',
            meta: {
                icon: null,
                text: "设置渲染"
            },
            component: () => import('../../views/DevTools/DbTest.vue')
        }]
}