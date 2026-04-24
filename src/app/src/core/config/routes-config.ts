import { Coin, Compass, Setting, SetUp, User } from '@element-plus/icons-vue';
import { RouteRecordRaw } from 'vue-router';

export let routesConfig: RouteRecordRaw[] = [
    {
        name: 'Home',
        path: '/',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            icon: Compass,
            title: "主页"
        }
    }, {
        name: 'BackupRestore',
        path: '/backup-restore',
        component: () => import('@/views/BackupAndRestoreView.vue'),
        meta: {
            icon: Coin,
            title: "备份与恢复"
        }
    }, {
        name: 'About',
        path: '/about',
        component: () => import('@/views/AboutView.vue'),
        meta: {
            icon: User,
            title: "关于"
        }
    }, {
        name: 'Settings',
        path: '/settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: {
            icon: Setting,
            title: "设置"
        }
    }, {
        name: "Dev",
        path: '/dev',
        component: () => import('@/views/DevView.vue')
        ,
        meta: {
            icon: SetUp,
            title: "开发者页面"
        }
    }
]