export const gameSettingsRoutesCfg =


{
    path: '/gameSettings',
    redirect: "/gameSettings/AudioSettings",
    meta: {
        icon: null,
        text: "游戏"
    },
    components: {
        default: () => import('../../components/SubMenu.vue'),
        content: () => import('../../forms/gameSettings/audioSettings.vue')
    },
    children: [
        {
            path: '/gameSettings/AudioSettings',
            meta: {
                icon: null,
                text: "音频"
            },
            component: () => import('../../forms/gameSettings/audioSettings.vue')
        },
        {
            path: '/gameSettings/VideoSettings',
            meta: {
                icon: null,
                text: "视频"
            },
            component: () => import('../../forms/gameSettings/videoSettings.vue')
        }
    ]
}