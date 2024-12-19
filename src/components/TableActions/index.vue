<script setup lang="ts">
import { h } from 'vue'
import { NSpace, NButton, NPopconfirm } from 'naive-ui'

interface Props {
  row: Record<string, any>
  actions?: ('edit' | 'view' | 'delete')[]
  onAction?: (type: 'edit' | 'view' | 'delete', row: Record<string, any>) => void
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

// 按钮配置
const buttonConfig = {
  edit: {
    text: '编辑',
    type: 'primary',
  },
  view: {
    text: '详情',
    type: 'default',
  },
  delete: {
    text: '删除',
    type: 'error',
  },
} as const

const handleClick = (type: 'edit' | 'view' | 'delete') => {
  props.onAction?.(type, props.row)
}

const renderButton = (action: 'edit' | 'view' | 'delete') => {
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
      <component :is="renderButton(action)" />
    </template>
  </NSpace>
</template> 