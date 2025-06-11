import { RouteRecordRaw } from 'vue-router';

export const appSettingsRoutesCfg: RouteRecordRaw =
{
    path: '/appSettings',
    redirect: "/appSettings/CommSettings",
    meta: {
        icon: null,
        text: "设置"
    },
    components: {
        default: () => import('@/components/Menu/SubMenu.vue'),
        content: () => import('../../views/appSettings/CommSettings.vue')
    },
    children: [
        {
            path: '/appSettings/CommSettings',
            meta: {
                icon: null,
                text: "一般"
            },
            component: () => import('../../views/appSettings/CommSettings.vue')
        }, {
            path: '/appSettings/NetSettings',
            meta: {
                icon: null,
                text: "网络"
            },
            component: () => import('../../views/appSettings/NetSettings.vue')
        }, {
            path: '/appSettings/PathSettings',
            meta: {
                icon: null,
                text: "路径"
            },
            component: () => import('../../views/appSettings/PathSettings.vue')
        }, {
            path: '/appSettings/AboutSettings',
            meta: {
                icon: null,
                text: "关于"
            },
            component: () => import('../../views/appSettings/AboutSettings.vue')
        }
    ]
}