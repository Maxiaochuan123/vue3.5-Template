<template>
  <span v-btnPermission="permissionId">
    <NPopconfirm
      :negative-text="cancelText"
      :positive-text="confirmText"
      @positive-click="$emit('click')"
    >
      <template #trigger>
        <NButton size="small" quaternary type="error">
          {{ permissionMap.delete }}
        </NButton>
      </template>
      {{ content }}
    </NPopconfirm>
  </span>
</template>

<script setup lang="ts">
import { NButton, NPopconfirm } from 'naive-ui'
import { permissionMap } from '@/permissions'

interface Props {
  content?: string
  confirmText?: string
  cancelText?: string
  permissionId: [string, string]
}

withDefaults(defineProps<Props>(), {
  content: '是否确认删除该条数据？',
  confirmText: '确认',
  cancelText: '取消'
})

defineEmits<{
  (e: 'click'): void
}>()</script> 