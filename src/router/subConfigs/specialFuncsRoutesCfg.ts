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
        // content: () => import('../forms/specialFuncs/keyBindSettings.vue')
    },
    children: [
        {
            path: '/specialFuncs/ConfigCloner',
            meta: {
                icon: null,
                text: "配置克隆"
            },
            component: () => import('../../forms/specialFuncs/ConfigCloner.vue')
        }, {
            path: '/specialFuncs/keyBindSettings',
            meta: {
                icon: null,
                text: "键位"
            },
            component: () => import('../../forms/specialFuncs/KeyBindSettings.vue')
        }
    ]
}
