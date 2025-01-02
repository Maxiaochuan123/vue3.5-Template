<template>
  <span v-btnPermission="permissionId">
    <NButton text type="primary" @click="$emit('click')">
      {{ buttonPermissionMap.detail }}
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
}>()
</script> 