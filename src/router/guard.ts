import { type Router } from 'vue-router'
import { useAuthStore } from '@/core/stores/modules/auth'
import type { RolePermission } from '@/core/api/modules/role'
import { createDiscreteApi } from 'naive-ui'
import appConfig from '@/core/config/appConfig'
import routes from './index'

const { loadingBar } = createDiscreteApi(['loadingBar'])

export function setupRouterGuard(router: Router) {
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

    // 根据配置决定是否启用权限检查
    if (requiresAuth && appConfig.enablePermissionMode) {
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
} 