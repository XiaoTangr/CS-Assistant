
import { UserRole } from '@/enums/common'
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router'

// 扩展 Vue Router 的 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresRole?: UserRole
    title?: string
    icon?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/PostView.vue'),
      meta: {
        requiresAuth: false,
        title: '首页',
      },
    },
    {
      path: '/auth/:type?', // type: register | login | reset，默认为 login
      name: 'auth',
      meta: {
        requiresAuth: false,
        title: '身份认证中心',
      },
      component: () => import('@/views/AuthView.vue'),
      beforeEnter: (to, from, next) => {
        // 如果没有 type 参数或 type 无效，重定向到默认的 login
        const validTypes = ['login', 'register', 'reset'];
        if (!to.params.type || !validTypes.includes(to.params.type as string)) {
          next({ path: '/auth/login', query: to.query });
        } else {
          next();
        }
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/posteidtor/:id?',
      name: 'posteidtor',
      component: () => import('@/views/dashboard/PostEdit.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRole.CREATOR,
        title: '新建发布',
        icon: 'DocumentAdd',
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      redirect: '/dashboard/bizpost/list',
      component: () => import('@/views/DashboardView.vue'),
      children: [
        {
          path: '/dashboard/bizpost',
          name: 'dashboard-bizpost',
          meta: {
            title: '发布管理',
            icon: 'House',
            requiresAuth: true,
            requiresRole: UserRole.CREATOR,
          },
          children: [
            {
              path: '/dashboard/bizpost/list',
              name: 'bizpost-list',
              component: () => import('@/views/dashboard/BizPost.vue'),
              meta: {
                requiresAuth: true,
                requiresRole: UserRole.CREATOR,
                title: '发布列表',
                icon: 'Document',
              },
            }
          ]
        }, {
          path: '/dashboard/sysuser',
          name: 'dashboard-sysuser',
          redirect: '/dashboard/sysuser/list',
          meta: {
            title: '用户管理',
            icon: 'User',
            requiresAuth: true,
            requiresRole: UserRole.ADMIN,
          },
          children: [
            {
              path: '/dashboard/sysuser/list',
              name: 'sysuser-list',
              component: () => import('@/views/dashboard/SysUser.vue'),
              meta: {
                requiresAuth: true,
                requiresRole: UserRole.ADMIN,
                title: '用户列表',
                icon: 'User',
              },
            },
          ]
        }
      ]
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  // 检查是否登录
  const currentSysUserStore = useCurrentUserStore()
  const { currentSysUser, isLogined } = storeToRefs(currentSysUserStore)

  // 如果未登录，尝试获取用户信息
  if (!isLogined.value) {
    try {
      await currentSysUserStore.fetchData()
    } catch {
      // 登录失败，跳转到登录页面
      next('/auth/login')
      return
    }
  }

  // 重新检查登录状态
  if (to.meta.requiresAuth && !isLogined.value) {
    // 未登录，跳转到登录页面
    next('/auth/login')
    return
  }

  // 检查角色权限
  const userRole: UserRole = currentSysUser.value?.role ?? UserRole.USER

  if (to.meta.requiresRole !== undefined && userRole < to.meta.requiresRole) {
    // 无权限，显示错误并跳转到首页
    ElMessage.error('没有访问权限!')
    next(from.path)
    return
  }

  // 允许通过
  next()
})

export default router