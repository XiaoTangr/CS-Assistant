import { createRouter, createWebHistory } from 'vue-router'
import { footerRouterConfig, mainRouterConfig } from './RoutesCfg'



export const MainRouter = createRouter({
    history: createWebHistory(),
    routes: [...mainRouterConfig, ...footerRouterConfig],
    
})