import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type Permission } from '@/core/api/modules/auth'
import { roleApi } from '@/core/api/modules/role'

interface Auth {
  token: string
  permissions: Permission[]
}

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<Auth>({
    token: '',
    permissions: [],
  })
  const isAuthenticated = ref(false)

  const initState = () => {
    const storedAuth = localStorage.getItem('auth')

    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth)
        auth.value = parsedAuth
        isAuthenticated.value = !!parsedAuth.token
      } catch (e) {
        console.error('解析 auth 数据失败:', e)
      }
    }
  }

  // 初始化状态
  initState()
  
  const login = async (userName: string, password: string) => {
    try {
      const mockPermissions = [
        {
          "id": "1",
          "key": "dashboard",
          "name": "数据概览",
          "isChecked": true,
          "permissions": [],
          "children": []
        },
        {
          "id": "2",
          "key": "account-equity",
          "name": "账户权益",
          "isChecked": true,
          "permissions": [],
          "children": []
        },
        {
          "id": "3",
          "key": "advertising",
          "name": "广告管理",
          "isChecked": true,
          "permissions": [
            "add",
            "edit",
            "delete",
            "setAdvertisingAccount"
          ],
          "children": []
        },
        {
          "id": "4",
          "key": "advertising-placement",
          "name": "广告投放",
          "isChecked": true,
          "permissions": [
            "advertisingPlacement",
            "followUpInvestment",
            "placementData"
          ],
          "children": []
        },
        {
          "id": "5",
          "key": "customer",
          "name": "客户管理",
          "isChecked": true,
          "permissions": [
            "audit",
            "detail",
            "updatePassword",
            "addContract"
          ],
          "children": []
        },
        {
          "id": "6",
          "key": "recharge-management",
          "name": "充值管理",
          "isChecked": true,
          "permissions": [],
          "children": [
            {
              "id": "6-1",
              "key": "recharge-apply",
              "name": "充值申请",
              "isChecked": true,
              "permissions": [
                "recharge",
                "detail"
              ],
              "children": []
            },
            {
              "id": "6-2",
              "key": "advertiser-management",
              "name": "广告主管理",
              "isChecked": true,
              "permissions": [
                "clearBalance"
              ],
              "children": []
            },
            {
              "id": "6-3",
              "key": "balance-change",
              "name": "余额变动",
              "isChecked": true,
              "permissions": [],
              "children": []
            }
          ]
        },
        {
          "id": "7",
          "key": "permission",
          "name": "权限管理",
          "isChecked": true,
          "permissions": [],
          "children": [
            {
              "id": "7-1",
              "key": "permission-account",
              "name": "账号管理",
              "isChecked": true,
              "permissions": [
                "add",
                "edit",
                "status",
                "delete",
                "view"
              ],
              "children": []
            },
            {
              "id": "7-2",
              "key": "permission-role",
              "name": "角色管理",
              "isChecked": true,
              "permissions": [
                "add",
                "edit",
                "status",
                "delete",
                "view"
              ],
              "children": []
            },
            {
              "id": "7-3",
              "key": "permission-log",
              "name": "系统日志",
              "isChecked": true,
              "permissions": [],
              "children": []
            }
          ]
        }
      ]

      // 登录获取 token
      const loginResponse = await authApi.login({ userName, password })
      if (loginResponse.code === 200) {
        auth.value.token = loginResponse.data
        isAuthenticated.value = true

        // 获取权限数据
        const permissionResponse = await authApi.getPermissions()
        if (permissionResponse.code === 200) {
          try {
            // 解析返回的权限字符串为 JSON 对象
            const parsedPermissions = JSON.parse(permissionResponse.data) as Permission[]
            auth.value.permissions = parsedPermissions
          } catch (error) {
            throw new Error('解析权限数据失败')
          }
        }
        // auth.value.permissions = mockPermissions

        // 持久化存储
        localStorage.setItem('auth', JSON.stringify(auth.value))

        return loginResponse
      } else {
        throw new Error(loginResponse.msg)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    auth.value = {
      token: '',
      permissions: [],
    }
    isAuthenticated.value = false

    // 清除持久化存储
    localStorage.removeItem('auth')
  }

  return {
    auth,
    isAuthenticated,
    login,
    logout,
  }
})
