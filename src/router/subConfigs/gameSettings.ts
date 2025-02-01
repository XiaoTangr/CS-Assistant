import { RouteRecordRaw } from 'vue-router'

export const gameSettingsRoutes: RouteRecordRaw[] =
    [
        {
            path: '/gameSettings/keyBindSettings',
            component: () => import('../../forms/gameSettings/keyBindSettings.vue')
        }
    ]