import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/core/stores/modules/auth'
import {
  HomeOutline,
  WalletOutline,
  MegaphoneOutline,
  CashOutline,
  DocumentTextOutline,
  ReceiptOutline,
  KeyOutline,
  PersonOutline,
  ShieldOutline,
  DocumentLockOutline,
  AppsOutline,
} from '@vicons/ionicons5'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/core/views/auth/login.vue'),
    meta: {
      requiresAuth: false,
      title: '登录',
    },
  },
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
          title: '首页',
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
        path: 'permission',
        name: 'permission',
        meta: {
          requiresAuth: true,
          title: '权限管理',
          icon: KeyOutline,
        },
        children: [
          {
            path: 'account',
            name: 'permission-account',
            component: () => import('@/core/views/permission/account/index.vue'),
            meta: {
              requiresAuth: true,
              title: '账号管理',
              icon: PersonOutline,
            },
          },
          {
            path: 'role',
            name: 'permission-role',
            component: () => import('@/core/views/permission/role/index.vue'),
            meta: {
              requiresAuth: true,
              title: '角色管理',
              icon: ShieldOutline,
            },
          },
          {
            path: 'log',
            name: 'permission-log',
            component: () => import('@/core/views/permission/log/index.vue'),
            meta: {
              requiresAuth: true,
              title: '系统日志',
              icon: DocumentLockOutline,
            },
          },
        ],
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
    // 获取当前路由及其所有父级路由的权限标题
    const routeTitles = to.matched
      .filter(route => route.meta?.title)
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
