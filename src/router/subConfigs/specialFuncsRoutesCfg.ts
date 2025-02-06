export const specialFuncsRoutesCfg =
{
    path: '/specialFuncs',
    redirect: "/specialFuncs/keyBindSettings",
    meta: {
        icon: null,
        text: "功能"
    },
    components: {
        default: () => import('../../components/SubMenu.vue'),
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
