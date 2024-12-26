<template>
  <NSpace>
    <AddButton 
      v-if="actions.includes('add')"
      v-btnPermission="[permissionId, 'add']"
      @click="onAdd"
    />

    <!-- <ExportButton 
      v-if="actions.includes('export')"
      v-btnPermission="[permissionId, 'export']"
      @click="onExport"
    />     -->
    
    <!-- 自定义按钮通过slot传入 -->
    <slot />
  </NSpace>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui'
import AddButton from './components/AddButton.vue'
import ExportButton from './components/ExportButton.vue'

type ActionType = 'add' | 'export'

interface Props {
  actions?: ActionType[]
  permissionId: string  // 当前页面的权限ID（必传）
  onAdd?: () => void
  // onExport?: () => void
}

withDefaults(defineProps<Props>(), {
  actions: () => ['add'],
  onAdd: () => {},
  // onExport: () => {}
})

/**
 * 在 table 中使用
 * <template #toolbar>
      <TableToolbarActions 
        :permission-id="'5-1'"
        :on-add="handleAdd"
      >
        <NButton
          v-btnPermission="['5-1', 'add']"
          type="success"
          @click="() => console.log('导出')"
        >
          导出
        </NButton>
      </TableToolbarActions>
    </template>
 */
</script> 