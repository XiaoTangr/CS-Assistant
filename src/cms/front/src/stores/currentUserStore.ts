import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import http from '@/util/http/request'
import type { SysUserDTO, UserRegisterDTO } from '@/types/SysUserDTO'
import type { ApiResponse } from '@/types/apiResponse'


export const useCurrentUserStore = defineStore('currentUserStore', () => {

  const currentSysUser = ref<SysUserDTO>()
  const isLogined = ref(false)

  const userRole = computed(() => {
    if (currentSysUser.value) {
      return currentSysUser.value.role
    }
    return 0
  })


  const userRoleStr = computed(() => {
    if (currentSysUser.value) {
      if (currentSysUser.value.role === 0) {
        return '普通用户'
      } else if (currentSysUser.value.role === 1) {
        return '创作者'
      } else if (currentSysUser.value.role === 2) {
        return '超级管理员'
      }
    }
    return null
  })

  const userStatus = computed(() => {
    if (currentSysUser.value) {

      if (currentSysUser.value.isDisable === false) {
        return '正常'
      } else if (currentSysUser.value.isDisable === true) {
        return '停用'
      }
    }
    return null
  })


  /**
   * 尝试使用本地存储的 token 获取当前用户信息，更新登录状态
   * @returns  0 成功获取用户信息，-1 获取失败（例如 token 无效或过期）
   */
  const fetchData = async () => {
    return await http.get<SysUserDTO>('/api/v1/auth/current').then((res) => {
      if (res.code === 200) {
        currentSysUser.value = res.data;
        isLogined.value = true;
        return 0;
      } else {
        localStorage.removeItem('token')
        currentSysUser.value = undefined;
        isLogined.value = false;
        return -1;
      }
    }).catch(() => {
      localStorage.removeItem('token')
      currentSysUser.value = undefined;
      isLogined.value = false;
      return -1;
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    currentSysUser.value = undefined;
    isLogined.value = false;
  }


  const login = async (email: string, password: string): Promise<ApiResponse> => {
    return await http.post<SysUserDTO>('/api/v1/auth/login',
      { username: email, password: password },
      { withToken: false })
      .then((res) => {
        console.log(res)

        if (res.code !== 200) {
          return res
        }
        currentSysUser.value = res.data;
        isLogined.value = true;

        return res
      })
      .catch((res) => {
        return res
      })
  }

  const register = async (regData: UserRegisterDTO): Promise<number | string> => {
    return await http.post<SysUserDTO>('/api/v1/auth/register',
      regData,
      { withToken: false })
      .then((res) => {
        if (res.code === 200) {
          return 0
        }
        return res.message
      })
      .catch((res) => {
        return res.message
      })
  }


  return { currentSysUser, isLogined, userRole, userRoleStr, userStatus, fetchData, logout, login, register }
})