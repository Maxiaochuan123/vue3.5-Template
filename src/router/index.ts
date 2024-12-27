import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
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
        path: 'financial',
        name: 'financial',
        meta: {
          requiresAuth: true,
          title: '财务管理',
          icon: CashOutline,
        },
        children: [
          {
            path: 'bill-management',
            name: 'bill-management',
            meta: {
              requiresAuth: true,
              title: '票据管理',
              icon: DocumentTextOutline,
            },
            children: [
              {
                path: 'invoice',
                name: 'invoice',
                component: () => import('@/views/financial/bill-management/invoice/index.vue'),
                meta: {
                  requiresAuth: true,
                  title: '发票',
                  icon: ReceiptOutline,
                },
              },
            ],
          },
        ],
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
            component: () => import('@/views/permission/account/index.vue'),
            meta: {
              requiresAuth: true,
              title: '账号管理',
              icon: PersonOutline,
            },
          },
          {
            path: 'role',
            name: 'permission-role',
            component: () => import('@/views/permission/role/index.vue'),
            meta: {
              requiresAuth: true,
              title: '角色管理',
              icon: ShieldOutline,
            },
          },
          {
            path: 'log',
            name: 'permission-log',
            component: () => import('@/views/permission/log/index.vue'),
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
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
