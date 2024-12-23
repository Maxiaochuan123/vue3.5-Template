<script setup lang="ts">
import { NSpace, NButton, NIcon } from 'naive-ui'
import { AddOutline, DownloadOutline } from '@vicons/ionicons5'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { permissionMap } from '@/permissions'

type ActionType = keyof typeof permissionMap

interface Props {
  onAdd?: () => void
  onExport?: () => void
}

defineProps<Props>()

const route = useRoute()
const authStore = useAuthStore()

// 递归查找当前页面的权限配置
const findCurrentPagePermission = (permissions: any[], routeMeta: any): any | null => {
  if (!routeMeta?.title) return null

  for (const permission of permissions) {
    if (permission.name === routeMeta.title) {
      return permission
    }
    if (permission.children && permission.children.length > 0) {
      const found = findCurrentPagePermission(permission.children, routeMeta)
      if (found) return found
    }
  }
  return null
}

// 检查按钮权限
const hasPermission = (actionType: ActionType) => {
  const currentPermission = findCurrentPagePermission(authStore.auth.permissions, route.meta)
  if (!currentPermission) return false
  
  return currentPermission.permissions?.includes(actionType)
}

// 检查是否有新增权限
const hasAddPermission = () => hasPermission('add')

// 检查是否有导出权限
const hasExportPermission = () => hasPermission('export')
</script>

<template>
  <NSpace>
    <!-- 新增 -->
    <NButton v-if="onAdd && hasAddPermission()" type="primary" @click="onAdd">
      <template #icon>
        <NIcon><AddOutline /></NIcon>
      </template>
      {{ permissionMap.add }}
    </NButton>

    <!-- 导出 -->
    <NButton v-if="onExport && hasExportPermission()" type="default" @click="onExport">
      <template #icon>
        <NIcon><DownloadOutline /></NIcon>
      </template>
      {{ permissionMap.export }}
    </NButton>
  </NSpace>
</template> 