import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/core/stores/modules/auth'
import type { RolePermission } from '@/core/api/modules/role'
import coreRoutes from '@/core/router/index'
import { createDiscreteApi } from 'naive-ui'
import {
  HomeOutline,
  WalletOutline,
  MegaphoneOutline,
  PersonOutline,
} from '@vicons/ionicons5'

const { loadingBar } = createDiscreteApi(['loadingBar'])


const routes: RouteRecordRaw[] = [
  // 从 coreRoutes 获取登录路由
  ...coreRoutes.filter(route => route.name === 'login'),
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/core/layout/PageLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '数据概览',
          icon: HomeOutline,
        },
      },
      {
        path: 'account-equity',
        name: 'account-equity',
        component: () => import('@/views/account-equity/index.vue'),
        meta: {
          title: '账户权益',
          icon: WalletOutline,
        },
      },
      {
        path: 'advertising',
        name: 'advertising',
        component: () => import('@/views/advertising/index.vue'),
        meta: {
          title: '广告管理',
          icon: MegaphoneOutline,
          permissions: ['add', 'edit', 'delete', 'setAdvertisingAccount'],
        },
      },
      {
        path: 'advertising-placement',
        name: 'advertising-placement',
        component: () => import('@/views/advertising-placement/index.vue'),
        meta: {
          title: '广告投放',
          icon: MegaphoneOutline,
          permissions: ['advertisingPlacement', 'followUpInvestment', 'placementData'],
        },
        children: [
          {
            path: ':id',
            name: 'advertising-placement-detail',
            component: () => import('@/views/advertising-placement/detail/index.vue'),
            meta: {
              title: '投放数据',
              hideInMenu: true,
            },
          }
        ]
      },
      {
        path: 'customer',
        name: 'customer',
        component: () => import('@/views/customer/index.vue'),
        meta: {
          title: '客户管理',
          icon: PersonOutline,
          permissions: ['audit', 'detail', 'updatePassword', 'addContract'],
        }
      },
      {
        path: 'recharge-management',
        name: 'recharge-management',
        redirect: '/recharge-management/recharge-apply',
        meta: {
          title: '充值管理',
          icon: WalletOutline,
        },
        children: [
          {
            path: 'recharge-apply',
            name: 'recharge-apply',
            component: () => import('@/views/recharge-apply/index.vue'),
            meta: {
              title: '充值申请',
              permissions: ['recharge', 'detail'],
            }
          },
          {
            path: 'advertiser-management',
            name: 'advertiser-management',
            component: () => import('@/views/advertiser-management/index.vue'),
            meta: {
              title: '广告主管理',
              permissions: ['clearBalance'],
            }
          },
          {
            path: 'balance-change',
            name: 'balance-change',
            component: () => import('@/views/balance-change/index.vue'),
            meta: {
              title: '余额变动',
            }
          }
        ]
      },
      
      // 从 coreRoutes 获取权限管理路由
      ...coreRoutes.filter(route => route.name === 'permission'),
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach((to, from, next) => {
  // 开始加载进度条
  loadingBar.start()
  
  const authStore = useAuthStore()
  
  // 检查认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !authStore.token) {
    loadingBar.error()
    next('/login')
    return
  }

  // 检查权限
  if (requiresAuth) {
    // 获取当前路由及其所有父级路由的 name（key），排除 Layout 和 hideInMenu 为 true 的路由
    const routeKeys = to.matched
      .filter(route => route.name && route.name !== 'Layout' && !route.meta?.hideInMenu)
      .map(route => route.name as string)

    // 如果没有需要检查的路由（比如只有 Layout），则允许访问
    if (routeKeys.length === 0) {
      next()
      return
    }

    // 递归检查权限
    const checkPermission = (permissions: RolePermission[], key: string): boolean => {
      for (const permission of permissions) {
        if (permission.key === key) {
          return permission.isChecked
        }
        if (permission.children?.length) {
          const hasPermission = checkPermission(permission.children, key)
          if (hasPermission) return true
        }
      }
      return false
    }

    // 检查路由链上的所有权限
    const hasAllPermissions = routeKeys.every(key => {
      const hasPermission = checkPermission(authStore.permissions, key)
      return hasPermission
    })

    if (!hasAllPermissions) {
      // 重定向到第一个有权限的路由
      const firstPermittedRoute = authStore.permissions.find((p: RolePermission) => p.isChecked)
      
      if (firstPermittedRoute) {
        const route = routes[1].children?.find(r => r.name === firstPermittedRoute.key)
        if (route) {
          loadingBar.error()
          next(route.path)
          return
        }
      }
      loadingBar.error()
      next('/login')
      return
    }
  }
  
  next()
})

// 添加全局后置钩子
router.afterEach(() => {
  // 结束加载进度条
  loadingBar.finish()
})

export default router
