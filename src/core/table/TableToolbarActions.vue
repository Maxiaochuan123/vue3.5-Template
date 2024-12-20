<script setup lang="ts">
import { NSpace, NButton, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'

interface Props {
  onAdd?: () => void
}

defineProps<Props>()
</script>

<template>
  <NSpace>
    <NButton v-if="onAdd" type="primary" @click="onAdd">
      <template #icon>
        <NIcon><AddOutline /></NIcon>
      </template>
      新增
    </NButton>
  </NSpace>
</template> 