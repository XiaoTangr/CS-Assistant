import { Compass, CopyDocument, Stamp, TurnOff, } from '@element-plus/icons-vue';

export const RouterConfig = [
    {
        name: 'appHome',
        path: '/',
        component: () => import('@/views/appHome.vue'),
        meta: {
            icon: Compass,
            text: "主页"
        }
    }, {
        name: 'ConfigCloner',
        path: "/configcloner",
        component: () => import('@/views/ConfigCloner.vue'),
        meta: {
            icon: CopyDocument,
            text: "CS配置克隆器"
        }
    },

    {
        name: 'appSettings',
        path: "/settings",
        component: () => import('@/views/allSettings.vue'),
        meta: {
            icon: TurnOff,
            text: "设置"
        }
    }, {
        name: 'devTools',
        path: "/devTools",
        component: () => import('@/views/DevTools.vue'),
        meta: {
            icon: Stamp,
            text: "开发者测试"
        }
    }

]