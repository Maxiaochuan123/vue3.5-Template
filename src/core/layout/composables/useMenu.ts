import { h } from 'vue'
import type { Component } from 'vue'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { NEllipsis, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

export interface CustomRouteMeta extends RouteMeta {
  title: string
  icon?: Component
  hideInMenu?: boolean
  requiresAuth?: boolean
  permissions?: string[]
}

export function useMenu() {
  // 构建菜单路径
  const buildMenuPath = (route: RouteRecordRaw, parentPath: string): string => {
    return parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`)
  }

  // 渲染图标
  const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  // 构建菜单项
  const buildMenuItem = (route: RouteRecordRaw, parentPath: string): MenuOption | null => {
    const meta = route.meta as CustomRouteMeta | undefined
    if (!meta?.title || meta.hideInMenu) return null

    const fullPath = buildMenuPath(route, parentPath)
    return {
      label: () => h(NEllipsis, null, { default: () => meta.title }),
      key: fullPath,
      icon: meta.icon ? renderIcon(meta.icon) : undefined,
      children: route.children
        ?.filter(child => !child.meta?.hideInMenu)
        .map(child => buildMenuItem(child, fullPath))
        .filter(Boolean) as MenuOption[] | undefined
    }
  }

  return {
    buildMenuItem,
    renderIcon
  }
} 