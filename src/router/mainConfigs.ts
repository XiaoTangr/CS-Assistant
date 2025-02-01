import { RouteRecordRaw } from 'vue-router'
import { appSettingsRoutes } from './subConfigs/appSettings'
import { gameSettingsRoutes } from './subConfigs/gameSettings'

export const mainRoutes: RouteRecordRaw[] =
    [
        {
            path: '/appSettings',
            name: 'appSettings',
            meta: {
                title: 'App Settings'
            },
            children: appSettingsRoutes
        },
        {
            path: '/gameSettings',
            name: 'gameSettings',
            meta: {
                title: 'Game Settings'
            },
            children: gameSettingsRoutes
        }
    ]