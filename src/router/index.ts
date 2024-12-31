import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/core/stores/modules/auth'
import coreRoutes from '@/core/router/index'
import {
  HomeOutline,
  WalletOutline,
  MegaphoneOutline,
  PersonOutline,
  AppsOutline,
} from '@vicons/ionicons5'

const routes: RouteRecordRaw[] = [
  ...coreRoutes,
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
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          requiresAuth: true,
          title: '数据概览',
          icon: HomeOutline,
        },
      },
      {
        path: 'account-equity',
        name: 'account-equity',
        component: () => import('@/views/account-equity/index.vue'),
        meta: {
          requiresAuth: true,
          title: '账户权益',
          icon: WalletOutline,
        },
      },
      {
        path: 'advertising',
        name: 'advertising',
        component: () => import('@/views/advertising/index.vue'),
        meta: {
          requiresAuth: true,
          title: '广告管理',
          icon: MegaphoneOutline,
        },
      },
      {
        path: 'advertising-placement',
        name: 'advertising-placement',
        component: () => import('@/views/advertising-placement/index.vue'),
        meta: {
          requiresAuth: true,
          title: '广告投放',
          icon: MegaphoneOutline,
        },
        children: [
          {
            path: ':id',
            name: 'advertising-placement-detail',
            component: () => import('@/views/advertising-placement/detail/index.vue'),
            meta: {
              requiresAuth: true,
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
          requiresAuth: true,
          title: '客户管理',
          icon: PersonOutline,
        }
      },
      {
        path: 'recharge-apply',
        name: 'recharge-apply',
        component: () => import('@/views/recharge-apply/index.vue'),
        meta: {
          requiresAuth: true,
          title: '充值申请',
          icon: PersonOutline,
        }
      },
      {
        path: 'robot-management',
        name: 'robot-management',
        component: () => import('@/views/robot-management/index.vue'),
        meta: {
          requiresAuth: true,
          title: '机器人管理',
          icon: AppsOutline,
        },
        children: [
          {
            path: ':id',
            name: 'robot-detail',
            component: () => import('@/views/robot-management/detail/index.vue'),
            meta: {
              requiresAuth: true,
              title: '机器人详情',
              hideInMenu: true,
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 首先检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // 然后检查权限
  if (to.meta.requiresAuth) {
    // 获取当前路由及其所有父级路由的权限标题，排除 hideInMenu 为 true 的路由
    const routeTitles = to.matched
      .filter(route => route.meta?.title && !route.meta?.hideInMenu)
      .map(route => route.meta?.title as string)

    // 递归检查权限
    const checkPermission = (permissions: any[], title: string): boolean => {
      for (const permission of permissions) {
        if (permission.name === title) {
          return permission.isChecked
        }
        if (permission.children?.length) {
          const hasPermission = checkPermission(permission.children, title)
          if (hasPermission) return true
        }
      }
      return false
    }

    // 检查路由链上的所有权限
    const hasAllPermissions = routeTitles.every(title => {
      return checkPermission(authStore.auth.permissions, title)
    })

    if (!hasAllPermissions) {
      // 重定向到第一个有权限的路由
      const firstPermittedRoute = authStore.auth.permissions.find(p => p.isChecked)
      if (firstPermittedRoute) {
        const route = routes[1].children?.find(r => r.meta?.title === firstPermittedRoute.name)
        if (route) {
          next(route.path)
          return
        }
      }
      next('/login')
      return
    }
  }
  
  next()
})

export default router
