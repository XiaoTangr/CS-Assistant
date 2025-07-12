import { createRouter, createWebHistory } from 'vue-router'
import { RouterConfig } from './RoutesCfg'

export const MainRouter = createRouter({
    history: createWebHistory(),
    routes: RouterConfig
})