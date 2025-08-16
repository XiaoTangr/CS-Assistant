import { Aim, Coin, Compass, CopyDocument, EditPen, Setting, SetUp } from '@element-plus/icons-vue';

export let mainRouterConfig = [
    {
        name: 'appHome',
        path: '/',
        component: () => import('@/views/AppHome.vue'),
        meta: {
            icon: Compass,
            text: "主页"
        }
    }, {
        name: 'CrosshairGallery',
        path: "/CrosshairGallery",
        component: () => import('@/views/CrosshairGallery.vue'),
        meta: {
            icon: Aim,

            text: "准星"
        }
    }, {
        name: 'AdvancedKeyBinding',
        path: "/AdvancedKeyBinding",
        component: () => import('@/views/AdvancedKeyBinding.vue'),
        meta: {
            icon: EditPen,

            text: "自定义按键绑定"
        }
    }, {
        name: 'ConfigCloner',
        path: "/configcloner",
        component: () => import('@/views/ConfigCloner.vue'),
        meta: {
            icon: CopyDocument,

            text: "配置克隆器"
        }
    }, {
        name: 'BackupAndRecovery',
        path: "/BackupAndRecovery",
        component: () => import('@/views/BackupAndRecovery.vue'),
        meta: {
            icon: Coin,

            text: "备份与恢复"
        }

    }
]

export let footerRouterConfig = [
    {
        name: 'devTools',
        path: "/devTools",
        component: () => import('@/views/DevTools.vue'),
        meta: {
            icon: SetUp,
            visible: false,
            text: "开发者工具"
        }
    }, {
        name: 'appSettings',
        path: "/settings",
        component: () => import('@/views/AllSettings.vue'),
        meta: {
            icon: Setting,

            text: "设置"
        }
    }, {
        name: 'about',
        path: "/about",
        component: () => import('@/views/AboutApp.vue'),
        meta: {
            icon: SetUp,

            text: "关于"
        }
    }
]