import { type RouteRecordRaw } from 'vue-router'
import coreRoutes from '@/core/router/index'
import appConfig from '@/core/config/appConfig'
import {
  HomeOutline,
  WalletOutline,
  MegaphoneOutline,
  PersonOutline,
} from '@vicons/ionicons5'

const routes: RouteRecordRaw[] = [
  // 从 coreRoutes 获取登录路由
  ...coreRoutes.filter(route => route.name === 'login'),
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/core/layout/index.vue'),
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
      ...(appConfig.enablePermissionMode ? coreRoutes.filter(route => route.name === 'permission') : []),
    ],
  },
]

export default routes
