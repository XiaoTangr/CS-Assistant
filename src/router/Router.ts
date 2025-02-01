import { createRouter, createWebHistory } from 'vue-router'

export const MainRouter = createRouter({
    history: createWebHistory(),
    routes:
        [
            {
                path: '/',
                component: () => import('../forms/appHome/MainForm.vue')
            },
            {
                path: '/appSettings',
                component: () => import('../components/SubMenus/appSettings.vue'),
                children: [
                    {
                        path: '/appSettings/CommSettings',
                        // component: () => import('../forms/appSettings/CommSettings.vue'),
                        component: () => import('../forms/appSettings/CommSettings.vue')

                    },
                    {
                        path: '/appSettings/AboutSettings',
                        component: () => import('../forms/appSettings/AboutSettings.vue')
                    }
                ]
            },
            {
                path: '/gameSettings',
                components: {
                    default: () => import('../components/SubMenus/gameSettings.vue'),
                    content: () => import('../forms/gameSettings/keyBindSettings.vue')
                },
                children: [
                    {
                        path: '/gameSettings/keyBindSettings',
                        component: () => import('../forms/gameSettings/keyBindSettings.vue')
                    },
                    {
                        path: '/gameSettings/VideoSettings',
                        component: () => import('../forms/gameSettings/VideoSettings.vue')
                    }
                ]
            }

        ]
})