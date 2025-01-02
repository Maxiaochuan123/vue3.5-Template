<template>
  <span v-btnPermission="permissionId">
    <NButton size="small" quaternary type="primary" @click="$emit('click')">
      {{ buttonPermissionMap.edit }}
    </NButton>
  </span>
</template>

<script setup lang="ts">
import { buttonPermissionMap } from '@/core/permissions-config/buttonMap'

defineProps<{
  permissionId: [string, string]
}>()

defineEmits<{
  (e: 'click'): void
}>()</script> 