import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/modules/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string>('')
    const isAuthenticated = ref<boolean>(false)

    // 登录
    async function login(userName: string, password: string) {
      try {
        const { code, data, msg } = await authApi.login({ userName, password })
        console.log('response data: ', data)

        if (code === 200) {
          token.value = data
          isAuthenticated.value = true

          return token.value
        }
        throw new Error(msg)
      } catch (error) {
        console.error('Login failed:', error.response?.data || error)
        throw error
      }
    }

    // 登出
    function logout() {
      token.value = ''
      isAuthenticated.value = false
    }

    return {
      token,
      isAuthenticated,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'auth',
      storage: localStorage,
    },
  },
)
