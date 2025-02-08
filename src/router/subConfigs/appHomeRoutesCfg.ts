
export const appHomeRoutesCfg =
{
    path: '/',
    redirect: "/appHome/welcome",
    meta: {
        icon: null,
        text: "主页"
    },
    components: {
        default: () => import('@/components/Menu/SubMenu.vue'),
        // content: () => import('../../forms/appHome/MainForm.vue')
    },
    children: [
        {
            path: '/appHome/welcome',
            name: 'welcome',
            meta: {
                icon: null,
                text: "首页"
            },
            component: () => import('../../forms/appHome/MainForm.vue')
        },
    ]
}