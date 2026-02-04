import { createRouter, createWebHistory } from 'vue-router'
import { mainRouterConfig } from '../core/config/Routes'

export const MainRouter = createRouter({
    history: createWebHistory(),
    routes: [...mainRouterConfig],
})
