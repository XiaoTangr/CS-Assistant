import { RouteRecordRaw } from 'vue-router'
import { specialFuncsRoutesCfg } from './subConfigs/specialFuncsRoutesCfg'
import { appHomeRoutesCfg } from './subConfigs/appHomeRoutesCfg'
import { appSettingsRoutesCfg } from './subConfigs/appSettingsRoutesCfg'
import { gameSettingsRoutesCfg } from './subConfigs/gameSettingsRoutesCfg'

export const mainsRouteCfg: RouteRecordRaw[] =
    [
        appHomeRoutesCfg,
        specialFuncsRoutesCfg,
        gameSettingsRoutesCfg,
        appSettingsRoutesCfg,
    ]