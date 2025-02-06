import { createRouter, createWebHistory } from 'vue-router'
import { mainsRouteCfg } from './mainRoutesCfg'

export const MainRouter = createRouter({
    history: createWebHistory(),
    routes: mainsRouteCfg
})