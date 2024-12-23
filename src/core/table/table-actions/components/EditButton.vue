<template>
  <NButton size="small" quaternary type="primary" @click="$emit('click')">
    {{ permissionMap.edit }}
  </NButton>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { permissionMap } from '@/permissions'

defineEmits<{
  (e: 'click'): void
}>()</script> 