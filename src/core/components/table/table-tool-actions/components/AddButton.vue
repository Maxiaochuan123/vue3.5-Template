<template>
  <NButton type="primary" @click="$emit('click')">
    <template #icon>
      <NIcon><AddOutline /></NIcon>
    </template>
    {{ buttonPermissionMap.add }}
  </NButton>
</template>

<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5'
import { buttonPermissionMap } from '@/core/permissions-config/buttonMap'

defineEmits<{
  (e: 'click'): void
}>()</script> 