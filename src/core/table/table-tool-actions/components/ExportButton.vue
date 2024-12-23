<template>
  <NButton type="default" @click="$emit('click')">
    <template #icon>
      <NIcon><DownloadOutline /></NIcon>
    </template>
    {{ permissionMap.export }}
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { DownloadOutline } from '@vicons/ionicons5'
import { permissionMap } from '@/permissions'

defineEmits<{
  (e: 'click'): void
}>()</script> 