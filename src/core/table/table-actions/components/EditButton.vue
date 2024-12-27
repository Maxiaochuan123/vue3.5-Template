<template>
  <span v-btnPermission="permissionId">
    <NButton size="small" quaternary type="primary" @click="$emit('click')">
      {{ permissionMap.edit }}
    </NButton>
  </span>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { permissionMap } from '@/core/permissions'

defineProps<{
  permissionId: [string, string]
}>()

defineEmits<{
  (e: 'click'): void
}>()</script> 