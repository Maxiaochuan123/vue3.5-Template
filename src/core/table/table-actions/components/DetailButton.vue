<template>
  <span v-btnPermission="permissionId">
    <NButton text type="primary" @click="$emit('click')">
      详情
    </NButton>
  </span>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'

defineProps<{
  permissionId: [string, string]
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script> 