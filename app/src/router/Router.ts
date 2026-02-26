import { createRouter, createWebHistory } from 'vue-router'
import { routesConfig } from '../core/config/routes-config'

export const MainRouter = createRouter({
    history: createWebHistory(),
    routes: [...routesConfig],
})
