<template>
  <NButton type="default" @click="$emit('click')">
    <template #icon>
      <NIcon><DownloadOutline /></NIcon>
    </template>
    {{ buttonPermissionMap.export }}
  </NButton>
</template>

<script setup lang="ts">
import { DownloadOutline } from '@vicons/ionicons5'
import { buttonPermissionMap } from '@/core/permissions-config/buttonMap'

defineEmits<{
  (e: 'click'): void
}>()</script> 