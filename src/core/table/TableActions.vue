<script setup lang="ts">
import { h } from 'vue'
import { NSpace, NButton, NPopconfirm } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { permissionMap } from '@/permissions'

// 表格行操作类型
type RowActionType = 'edit' | 'view' | 'delete'

interface Props {
  row: Record<string, any>
  actions?: RowActionType[]
  onAction?: (type: RowActionType, row: Record<string, any>) => void
  deleteConfig?: {
    content?: string
    confirmText?: string
    cancelText?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => ['edit', 'view', 'delete'],
  deleteConfig: () => ({
    content: '是否确认删除该条数据？',
    confirmText: '确认',
    cancelText: '取消'
  })
})

const route = useRoute()
const authStore = useAuthStore()

// 按钮配置
const buttonConfig: Record<RowActionType, { text: string; type: 'primary' | 'default' | 'error'; permission: RowActionType }> = {
  edit: {
    text: permissionMap.edit,
    type: 'primary',
    permission: 'edit'
  },
  view: {
    text: permissionMap.view,
    type: 'default',
    permission: 'view'
  },
  delete: {
    text: permissionMap.delete,
    type: 'error',
    permission: 'delete'
  }
} as const

// 递归查找当前页面的权限配置
const findCurrentPagePermission = (permissions: any[], routeMeta: any): any | null => {
  if (!routeMeta?.title) return null

  // 获取完整的路由路径
  const routePath = route.matched
    .map(r => r.meta?.title as string)
    .filter(Boolean)

  // 递归查找匹配的权限
  const findInPermissions = (perms: any[], pathSegments: string[]): any | null => {
    // 如果没有更多的路径段，返回null
    if (pathSegments.length === 0) return null

    const [currentSegment, ...remainingSegments] = pathSegments

    // 在当前层级查找匹配的权限
    const matchedPerm = perms.find(p => p.name === currentSegment)
    if (!matchedPerm) return null

    // 如果是最后一个路径段，返回找到的权限
    if (remainingSegments.length === 0) {
      return matchedPerm
    }

    // 如果还有剩余路径段，继续在子权限中查找
    if (matchedPerm.children && matchedPerm.children.length > 0) {
      return findInPermissions(matchedPerm.children, remainingSegments)
    }

    return null
  }

  return findInPermissions(permissions, routePath)
}

// 检查按钮权限
const hasPermission = (actionType: RowActionType) => {
  const currentPermission = findCurrentPagePermission(authStore.auth.permissions, route.meta)
  if (!currentPermission) return false
  
  return currentPermission.permissions?.includes(actionType)
}

const handleClick = (type: RowActionType) => {
  props.onAction?.(type, props.row)
}

const renderButton = (action: RowActionType) => {
  // 检查权限，如果没有权限则不渲染按钮
  if (!hasPermission(action)) {
    return null
  }

  const button = h(
    NButton,
    {
      size: 'small',
      quaternary: true,
      type: buttonConfig[action].type,
      onClick: action !== 'delete' ? () => handleClick(action) : undefined,
    },
    { default: () => buttonConfig[action].text }
  )

  if (action === 'delete') {
    return h(
      NPopconfirm,
      {
        negativeText: props.deleteConfig?.cancelText,
        positiveText: props.deleteConfig?.confirmText,
        onPositiveClick: () => handleClick('delete')
      },
      {
        default: () => props.deleteConfig?.content,
        trigger: () => button
      }
    )
  }

  return button
}
</script>

<template>
  <NSpace justify="center" align="center">
    <template v-for="action in actions" :key="action">
      <component :is="renderButton(action)" v-if="renderButton(action)" />
    </template>
  </NSpace>
</template> 