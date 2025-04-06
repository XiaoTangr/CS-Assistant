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
        content: () => import('../../forms/appSettings/CommSettings.vue')
    },
    children: [
        {
            path: '/appSettings/CommSettings',
            meta: {
                icon: null,
                text: "一般"
            },
            component: () => import('../../forms/appSettings/CommSettings.vue')
        }, {
            path: '/appSettings/NetSettings',
            meta: {
                icon: null,
                text: "网络"
            },
            component: () => import('../../forms/appSettings/NetSettings.vue')
        }, {
            path: '/appSettings/PathSettings',
            meta: {
                icon: null,
                text: "路径"
            },
            component: () => import('../../forms/appSettings/PathSettings.vue')
        }, {
            path: '/appSettings/AboutSettings',
            meta: {
                icon: null,
                text: "关于"
            },
            component: () => import('../../forms/appSettings/AboutSettings.vue')
        }
    ]
}