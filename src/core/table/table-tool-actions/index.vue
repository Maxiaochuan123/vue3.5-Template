<template>
    <NSpace :size="slotCount >= 1 ? 12 : 0">
      <AddButton 
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
import { computed, useSlots, type Slots } from 'vue'
import { NSpace } from 'naive-ui'
import AddButton from './components/AddButton.vue'
// import ExportButton from './components/ExportButton.vue'


interface Props {
  permissionId: string  // 当前页面的权限ID（必传）
  onAdd?: () => void
  // onExport?: () => void
}

withDefaults(defineProps<Props>(), {
  permissionId: '',
  onAdd: () => {},
  // onExport: () => {}
})

const slots: Slots = useSlots()
const slotCount = computed((): number => {
  return slots.default?.()?.length || 0
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