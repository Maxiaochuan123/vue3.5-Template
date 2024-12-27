<template>
  <NButton type="primary" @click="$emit('click')">
    <template #icon>
      <NIcon><AddOutline /></NIcon>
    </template>
    {{ permissionMap.add }}
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { permissionMap } from '@/core/permissions'

defineEmits<{
  (e: 'click'): void
}>()</script> 