import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type Permission } from '@/core/api/modules/auth'
import { roleApi, type RoleOptions } from '@/core/api/modules/role'

interface Auth {
  token: string
  permissions: Permission[]
  roleOptions: RoleOptions[]
}

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<Auth>({
    token: '',
    permissions: [],
    roleOptions: [],
  })
  const isAuthenticated = ref(false)

  // 从 localStorage 恢复状态
  // const initState = () => {
  //   // 自动设置认证状态
  //   auth.value = {
  //     token: 'mock-token',
  //     permissions: [
  //       {
  //         id: '1',
  //         name: '首页',
  //         isChecked: true,
  //         permissions: [],
  //         children: [],
  //       },
  //       {
  //         id: '2',
  //         name: '账户权益',
  //         isChecked: true,
  //         permissions: [],
  //         children: [],
  //       },
  //       {
  //         id: '3',
  //         name: '广告管理',
  //         isChecked: true,
  //         permissions: ['edit', 'view'],
  //         children: [],
  //       },
  //       {
  //         id: '4',
  //         name: '权限管理',
  //         isChecked: true,
  //         permissions: [],
  //         children: [
  //           {
  //             id: '4-1',
  //             name: '账号管理',
  //             isChecked: true,
  //             permissions: [],
  //             children: [],
  //           },
  //           {
  //             id: '4-2',
  //             name: '角色管理',
  //             isChecked: true,
  //             permissions: [],
  //             children: [],
  //           },
  //           {
  //             id: '4-3',
  //             name: '系统日志',
  //             isChecked: true,
  //             permissions: [],
  //             children: [],
  //           },
  //         ],
  //       },
  //       {
  //         id: '5',
  //         name: '机器人管理',
  //         isChecked: true,
  //         permissions: ['view', 'add', 'edit', 'delete'],
  //         children: [],
  //       },
  //     ],
  //   }
  //   isAuthenticated.value = true
  //   localStorage.setItem('auth', JSON.stringify(auth.value))
  // }

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
          id: '1',
          name: '数据概览',
          isChecked: true,
          permissions: [],
          children: [],
        },
        {
          id: '2',
          name: '账户权益',
          isChecked: true,
          permissions: [],
          children: [],
        },
        {
          id: '3',
          name: '广告管理',
          isChecked: true,
          permissions: ['add', 'edit', 'delete', 'setAdvertisingAccount'],
          children: [],
        },
        {
          id: '4',
          name: '广告投放',
          isChecked: true,
          permissions: ['advertisingPlacement', 'followUpInvestment', 'placementData'],
          children: [],
        },
        {
          id: '5',
          name: '客户管理',
          isChecked: true,
          permissions: ['audit', 'detail', 'updatePassword', 'addContract'],
          children: [],
        },
        {
          id: '6',
          name: '充值管理',
          isChecked: true,
          permissions: [],
          children: [
            {
              id: '6-1',
              name: '充值申请',
              isChecked: true,
              permissions: ['recharge', 'detail'],
              children: [],
            },
            {
              id: '6-2',
              name: '广告主管理',
              isChecked: true,
              permissions: ['clearBalance'],
              children: [],
            },
            // {
            //   id: '6-3',
            //   name: '余额变动',
            //   isChecked: true,
            //   permissions: [],
            //   children: [],
            // },
          ],
        },
        // {
        //   id: '5',
        //   name: '权限管理',
        //   isChecked: true,
        //   permissions: [],
        //   children: [
        //     {
        //       id: '5-1',
        //       name: '账号管理',
        //       isChecked: true,
        //       permissions: ['add', 'edit', 'status', 'delete', 'view'],
        //       children: [],
        //     },
        //     {
        //       id: '5-2',
        //       name: '角色管理',
        //       isChecked: true,
        //       permissions: ['add', 'edit', 'status', 'delete', 'view'],
        //       children: [],
        //     },
        //     {
        //       id: '5-3',
        //       name: '系统日志',
        //       isChecked: true,
        //       permissions: [],
        //       children: [],
        //     },
        //   ],
        // },
        // {
        //   id: '6',
        //   name: '机器人管理',
        //   isChecked: false,
        //   permissions: ['view', 'add', 'edit', 'delete'],
        //   children: [],
        // },
      ]

      // 登录获取 token
      const loginResponse = await authApi.login({ userName, password })
      if (loginResponse.code === 200) {
        auth.value.token = loginResponse.data
        isAuthenticated.value = true

        // 获取权限数据
        // const permissionResponse = await authApi.getPermissions()
        // if (permissionResponse.code === 200) {
        //   auth.value.permissions = permissionResponse.data
        // }

        // 获取角色下拉列表
        const roleOptionsResponse = await roleApi.getRoleOptions()
        if (roleOptionsResponse.code === 200) {
          auth.value.roleOptions = roleOptionsResponse.data
        }

        auth.value.permissions = mockPermissions

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
      roleOptions: [],
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
