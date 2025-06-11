import { RouteRecordRaw } from 'vue-router';

export const appHomeRoutesCfg: RouteRecordRaw =
{
    path: '/',
    redirect: "/appHome/welcome",
    meta: {
        icon: null,
        text: "主页"
    },
    components: {
        default: () => import('@/components/Menu/SubMenu.vue'),
        // content: () => import('../../views/appHome/MainForm.vue')
    },
    children: [
        {
            path: '/appHome/welcome',
            name: 'welcome',
            meta: {
                icon: null,
                text: "首页"
            },
            component: () => import('../../views/appHome/MainForm.vue')
        },
    ]
}