<template>
  <span v-btnPermission="permissionId">
    <NButton size="small" quaternary type="default" @click="$emit('click')">
      {{ permissionMap.view }}
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