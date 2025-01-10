import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/core/api/modules/auth'
import commonApi from '@/api/modules/common'
import type { RolePermission } from '@/core/api/modules/role'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const permissions = ref<RolePermission[]>([])
  const uploadToken = ref('')

  const login = async (userName: string, password: string) => {
    try {
      // 登录获取 token
      const loginResponse = await authApi.login({ userName, password })
      if (loginResponse.code === 200) {
        token.value = loginResponse.data

        // 获取权限数据
        const permissionResponse = await authApi.getPermissions()
        if (permissionResponse.code === 200) {
          try {
            // 解析返回的权限字符串为 JSON 对象
            const parsedPermissions = JSON.parse(permissionResponse.data) as RolePermission[]
            permissions.value = parsedPermissions
          } catch (error) {
            throw new Error('解析权限数据失败')
          }
        }

        // 获取上传凭证
        const uploadTokenResponse = await commonApi.uploadToken()
        if (uploadTokenResponse.code === 200) {
          uploadToken.value = uploadTokenResponse.data
        }

        return loginResponse
      } else {
        throw new Error(loginResponse.msg)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    token.value = ''
    permissions.value = []
    uploadToken.value = ''
  }

  return {
    token,
    permissions,
    uploadToken,
    login,
    logout,
  }
}, {
  persist: true
})
