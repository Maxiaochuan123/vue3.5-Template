import type { RouteRecordRaw } from 'vue-router'
import {
    KeyOutline,
    PersonOutline,
    ShieldOutline,
    DocumentLockOutline,
  } from '@vicons/ionicons5'

const coreRoutes: RouteRecordRaw[] = [
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
        path: '/permission',
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
]

export default coreRoutes