import { RouteRecordRaw } from 'vue-router';

export const specialFuncsRoutesCfg: RouteRecordRaw =
{
    path: '/specialFuncs',
    redirect: "/specialFuncs/keyBindSettings",
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
            path: '/specialFuncs/keyBindSettings',
            meta: {
                icon: null,
                text: "键位"
            },
            component: () => import('../../forms/specialFuncs/keyBindSettings.vue')
        }
    ]
}
