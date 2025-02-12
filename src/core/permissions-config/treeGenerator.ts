import type { RouteRecordRaw } from 'vue-router'
import routes from '@/router/index'

// 缓存生成的权限菜单树
let cachedPermissionMenus: any = null
let cachedRouteConfig: string = ''

// 从路由配置生成权限菜单
const generatePermissionMenus = () => {
  // 获取当前路由配置的字符串表示
  const currentRouteConfig = JSON.stringify(routes.map((route: RouteRecordRaw) => ({
    name: route.name,
    meta: route.meta,
    children: route.children
  })))

  // 如果配置没有变化且已有缓存，直接返回缓存
  if (cachedRouteConfig === currentRouteConfig && cachedPermissionMenus) {
    return cachedPermissionMenus
  }

  // console.log('\n=== 生成权限菜单 ===')
  const mainRoutes: RouteRecordRaw[] = []
  
  // 获取所有路由
  routes.forEach((route: RouteRecordRaw) => {
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
    
    // console.log(`处理路由: ${String(route.name)}`)
    // console.log('Meta:', route.meta)
    
    const result = {
      id: currentId,
      key: route.name as string,
      name: route.meta.title as string,
      isChecked: true,
      permissions: (route.meta.permissions as string[]) || [],
      children: [] as any[]
    }
    
    // console.log('生成节点:', {
    //   id: result.id,
    //   key: result.key,
    //   name: result.name,
    //   permissions: result.permissions
    // })
    
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

  // console.log('\n生成的权限菜单树:', JSON.stringify(permissionMenus, null, 2))

  // 更新缓存
  cachedRouteConfig = currentRouteConfig
  cachedPermissionMenus = permissionMenus

  return permissionMenus
}

// 权限配置
export const permissionMenus = generatePermissionMenus()

// 导出重新生成权限菜单的方法，以便在需要时手动触发
export const regeneratePermissionMenus = () => {
  cachedRouteConfig = ''
  cachedPermissionMenus = null
  return generatePermissionMenus()
}