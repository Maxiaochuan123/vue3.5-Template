<template>
  <NButton size="small" quaternary type="default" @click="$emit('click')">
    {{ permissionMap.view }}
  </NButton>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { permissionMap } from '@/permissions'

defineEmits<{
  (e: 'click'): void
}>()</script> 