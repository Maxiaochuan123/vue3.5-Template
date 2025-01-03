<template>
  <NSpace :size="customButtons.length >= 1 ? 12 : 0">
    <AddButton 
      v-if="actions.includes('add')"
      v-btnPermission="[permissionId, 'add']"
      @click="onAdd"
    />

    <ExportButton 
      v-if="actions.includes('export')"
      v-btnPermission="[permissionId, 'export']"
      @click="onExport"
    />

    <!-- 自定义按钮 -->
    <template v-for="(btn, index) in customButtons" :key="index">
      <NButton
        v-btnPermission="[permissionId, btn.action]"
        :type="btn.type || 'default'"
        @click="btn.onClick"
      >
        <template #icon v-if="btn.icon">
          <NIcon><component :is="btn.icon" /></NIcon>
        </template>
        {{ btn.label }}
      </NButton>
    </template>

  </NSpace>
</template>

<script setup lang="ts">
import { computed, useSlots, type Slots, type Component } from 'vue'
import { NSpace, NButton, NIcon } from 'naive-ui'
import AddButton from './components/AddButton.vue'
import ExportButton from './components/ExportButton.vue'

export type ToolbarActionType = 'add' | 'export'

// 自定义按钮类型
export interface CustomToolbarButton {
  label: string
  action: string
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  icon?: Component
  onClick: () => void
}

interface Props {
  permissionId: string  // 当前页面的权限ID（必传）
  actions?: ToolbarActionType[]  // 显示的操作按钮
  customButtons?: CustomToolbarButton[]  // 自定义按钮
  onAdd?: () => void
  onExport?: () => void
}

withDefaults(defineProps<Props>(), {
  permissionId: '',
  actions: () => [],
  customButtons: () => [],
  onAdd: () => {},
  onExport: () => {}
})

// const slots: Slots = useSlots()
// const slotCount = computed((): number => {
//   return slots.default?.()?.length || 0
// })
</script> 