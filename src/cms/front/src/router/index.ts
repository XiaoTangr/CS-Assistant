
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresRole: 2 } // 需要管理员权限
    }, {
      path: '/creator',
      name: 'creator',
      component: () => import('@/views/CreatorView.vue'),
      meta: { requiresRole: 1 } // 需要创作者权限
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const currentUserStore = useCurrentUserStore()
  const { currentSysUser, isLogined } = storeToRefs(currentUserStore)
  if (!isLogined.value) {
    await currentUserStore.fetchData()
  }

  if (to.meta.requiresRole !== undefined) {
    const requiredRole = to.meta.requiresRole as number
    if (currentSysUser.value?.role && currentSysUser.value?.role < requiredRole) {
      ElMessage.error('权限不足')
      next(false)
      return
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router