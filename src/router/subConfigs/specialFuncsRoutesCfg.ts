import { RouteRecordRaw } from 'vue-router';

export const specialFuncsRoutesCfg: RouteRecordRaw =
{
    path: '/specialFuncs',
    redirect: "/specialFuncs/ConfigCloner",
    meta: {
        icon: null,
        text: "功能"
    },
    components: {
        default: () => import('@/components/Menu/SubMenu.vue'),
        // content: () => import('../views/specialFuncs/keyBindSettings.vue')
    },
    children: [
        {
            path: '/specialFuncs/ConfigCloner',
            meta: {
                icon: null,
                text: "配置克隆"
            },
            component: () => import('../../views/specialFuncs/ConfigCloner.vue')
        }, {
            path: '/specialFuncs/keyBindSettings',
            meta: {
                icon: null,
                text: "键位"
            },
            component: () => import('../../views/specialFuncs/KeyBindSettings.vue')
        }
    ]
}
