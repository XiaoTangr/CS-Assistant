export const appSettingsRoutesCfg =
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
                text: "通用设置"
            },
            component: () => import('../../forms/appSettings/CommSettings.vue')
        },
        {
            path: '/appSettings/AboutSettings',
            meta: {
                icon: null,
                text: "关于"
            },
            component: () => import('../../forms/appSettings/AboutSettings.vue')
        }
    ]
}