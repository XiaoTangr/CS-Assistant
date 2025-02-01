import { createMemoryHistory, createRouter } from 'vue-router'
import { mainRoutes } from './mainConfigs'

export const MainRouter = createRouter({
    history: createMemoryHistory(),
    routes:
        [
            {
                path: '/',
                component: () => import('../forms/appHome/MainForm.vue'),
                meta: {
                    title: 'Home'
                },
                children: mainRoutes
            }
        ]
})