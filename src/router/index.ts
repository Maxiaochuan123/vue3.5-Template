import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
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
        },
      },
      {
        path: 'account-equity',
        name: 'account-equity',
        component: () => import('@/views/account-equity/index.vue'),
        meta: {
          requiresAuth: true,
          title: '账户权益',
        },
      },
      {
        path: 'advertising-management',
        name: 'advertising-management',
        component: () => import('@/views/advertising-management/index.vue'),
        meta: {
          requiresAuth: true,
          title: '广告管理',
        },
      },
      {
        path: 'financial',
        name: 'financial',
        meta: {
          requiresAuth: true,
          title: '财务管理',
        },
        children: [
          {
            path: 'bill-management',
            name: 'bill-management',
            component: () => import('@/views/financial/bill-management/index.vue'),
            meta: {
              requiresAuth: true,
              title: '票据管理',
            },
          },
        ],
      },
      {
        path: 'permission',
        name: 'permission',
        meta: {
          requiresAuth: true,
          title: '权限管理',
        },
        children: [
          {
            path: 'account',
            name: 'permission-account',
            component: () => import('@/views/permission/account/index.vue'),
            meta: {
              requiresAuth: true,
              title: '账号管理',
            },
          },
          {
            path: 'role',
            name: 'permission-role',
            component: () => import('@/views/permission/role/index.vue'),
            meta: {
              requiresAuth: true,
              title: '角色管理',
            },
          },
          {
            path: 'log',
            name: 'permission-log',
            component: () => import('@/views/permission/log/index.vue'),
            meta: {
              requiresAuth: true,
              title: '系统日志',
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
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
