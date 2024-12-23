<template>
  <NSpace justify="center" align="center">
    <template v-for="action in actions" :key="action">
      <EditButton 
        v-if="action === 'edit' && hasPermission('edit')" 
        @click="handleAction('edit')" 
      />
      <ViewButton 
        v-if="action === 'view' && hasPermission('view')" 
        @click="handleAction('view')" 
      />
      <DeleteButton 
        v-if="action === 'delete' && hasPermission('delete')" 
        v-bind="deleteConfig"
        @click="handleAction('delete')" 
      />
    </template>
  </NSpace>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import EditButton from './components/EditButton.vue'
import ViewButton from './components/ViewButton.vue'
import DeleteButton from './components/DeleteButton.vue'

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

// 处理按钮点击
const handleAction = (type: RowActionType) => {
  props.onAction?.(type, props.row)
}
</script> 