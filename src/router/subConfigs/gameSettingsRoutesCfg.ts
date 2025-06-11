import { RouteRecordRaw } from 'vue-router';

export const gameSettingsRoutesCfg: RouteRecordRaw =


{
    path: '/gameSettings',
    redirect: "/gameSettings/AudioSettings",
    meta: {
        icon: null,
        text: "游戏"
    },
    components: {
        default: () => import('@/components/Menu/SubMenu.vue'),
        content: () => import('../../views/gameSettings/AudioSettings.vue')
    },
    children: [
        {
            path: '/gameSettings/AudioSettings',
            meta: {
                icon: null,
                text: "音频"
            },
            component: () => import('../../views/gameSettings/AudioSettings.vue')
        },
        {
            path: '/gameSettings/VideoSettings',
            meta: {
                icon: null,
                text: "视频"
            },
            component: () => import('../../views/gameSettings/VideoSettings.vue')
        }
    ]
}