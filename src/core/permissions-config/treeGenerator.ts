import type { RouteRecordRaw } from 'vue-router'
import router from '@/router/index'

// 从路由配置生成权限菜单
const generatePermissionMenus = () => {
  const mainRoutes: RouteRecordRaw[] = []
  const routes = router.options.routes
  
  // 获取所有路由
  routes.forEach(route => {
    if (route.name === 'Layout' && route.children) {
      mainRoutes.push(...route.children)
    }
  })

  // 为每个层级维护独立的计数器
  const counters = new Map<string, number>()

  const getNextId = (parentId?: string): string => {
    const key = parentId || 'root'
    const currentCount = (counters.get(key) || 0) + 1
    counters.set(key, currentCount)
    return parentId ? `${parentId}-${currentCount}` : String(currentCount)
  }

  const processRoute = (route: RouteRecordRaw, parentId?: string): any => {
    // 跳过登录路由和详情页面
    if (route.name === 'login' || route.path.includes(':id')) {
      return null
    }

    // 如果没有 meta 或 title，跳过
    if (!route.meta?.title) {
      return null
    }
    
    // 生成当前节点的ID
    const currentId = getNextId(parentId)
    
    const result = {
      id: currentId,
      key: route.name as string,
      name: route.meta.title as string,
      isChecked: true,
      permissions: (route.meta.permissions as string[]) || [],
      children: [] as any[]
    }
    
    // 处理子路由
    if (route.children) {
      result.children = route.children
        .map(child => processRoute(child, currentId))
        .filter(child => child !== null)
    }

    return result
  }

  // 处理所有路由
  const permissionMenus = mainRoutes
    .map(route => processRoute(route))
    .filter(menu => menu !== null)

  // 打印生成的权限菜单，方便检查
  console.log('Generated Permission Menus:', JSON.stringify(permissionMenus, null, 2))

  return permissionMenus
}

// 权限配置
export const permissionMenus = generatePermissionMenus()