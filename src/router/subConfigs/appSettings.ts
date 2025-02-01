import { RouteRecordRaw } from 'vue-router'

export const appSettingsRoutes: RouteRecordRaw[] =
    [
        {
            path: '/appSettings/CommSettings',
            component: () => import('../../forms/appSettings/CommSettings.vue')
        }
    ]