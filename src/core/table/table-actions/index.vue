<template>
  <NSpace justify="center" align="center">
    <template v-for="action in actions" :key="action">
      <EditButton 
        v-if="action === 'edit'"
        :permission-id="[permissionId, 'edit']"
        @click="handleAction('edit')" 
      />
      <ViewButton 
        v-if="action === 'view'"
        :permission-id="[permissionId, 'view']"
        @click="handleAction('view')" 
      />
      <DeleteButton 
        v-if="action === 'delete'"
        :permission-id="[permissionId, 'delete']"
        v-bind="deleteConfig"
        @click="handleAction('delete')" 
      />
      <DetailButton 
        v-if="action === 'detail'"
        :permission-id="[permissionId, 'detail']"
        @click="handleAction('detail')" 
      />
    </template>
    <!-- 自定义按钮 -->
    <template v-for="(btn, index) in customButtons" :key="index">
      <span v-btnPermission="[permissionId, btn.action]">
        <NButton
          :type="btn.type || 'primary'"
          text
          @click="btn.onClick(row)"
        >
          {{ btn.label }}
        </NButton>
      </span>
    </template>
  </NSpace>
</template>

<script setup lang="ts">
import { NSpace, NButton } from 'naive-ui'
import { useRoute } from 'vue-router'
import EditButton from './components/EditButton.vue'
import ViewButton from './components/ViewButton.vue'
import DeleteButton from './components/DeleteButton.vue'
import DetailButton from './components/DetailButton.vue'

export type RowActionType = 'edit' | 'view' | 'delete' | 'detail'

// 自定义按钮类型
interface CustomButton {
  label: string
  action: string
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  onClick: (row: any) => void
}

interface Props<T = Record<string, any>> {
  row: T
  actions?: RowActionType[]
  customButtons?: CustomButton[]
  permissionId: string
  onAction?: (type: RowActionType, row: any) => void
  deleteConfig?: {
    content?: string
    confirmText?: string
    cancelText?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => ['edit', 'view', 'delete', 'detail'],
  customButtons: () => [],
  deleteConfig: () => ({
    content: '是否确认删除该条数据？',
    confirmText: '确认',
    cancelText: '取消'
  })
})

// 处理按钮点击
const handleAction = (type: RowActionType) => {
  props.onAction?.(type, props.row)
}

/**
 * 在 table 中使用
 * render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        permissionId: '5-1',
        actions: ['edit', 'view', 'delete'],
        deleteConfig: {
          content: '确定要删除该账号吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'edit':
            case 'view':
              handleUserForm(rowData, type)
              break
            case 'delete':
              console.log('删除', rowData)
              break
          }
        },
        // 添加自定义按钮
        customButtons: [
          {
            label: '重置密码',
            type: 'warning',
            action: 'edit',
            onClick: (row) => console.log('重置密码')
          },
          {
            label: '分配权限',
            action: 'edit',
            onClick: (row) => console.log('分配权限')
          }
        ],
      })
    },
 */
</script> 