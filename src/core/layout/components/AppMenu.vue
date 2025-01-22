<template>
  <n-menu
    :value="modelValue"
    :collapsed="collapsed"
    :options="menuOptions"
    :icon-size="24"
    @update:value="$emit('update:modelValue', $event)"
    accordion
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useMenu } from '../composables'

defineProps<{
  modelValue: string
  collapsed: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const router = useRouter()
const { buildMenuItem } = useMenu()

const menuOptions = computed<MenuOption[]>(() => {
  const layoutRoute = router.getRoutes().find((route) => route.name === 'Layout')
  if (!layoutRoute?.children) return []
  return layoutRoute.children
    .map(route => buildMenuItem(route, ''))
    .filter(Boolean) as MenuOption[]
})
</script>

<style lang="less">
.n-menu.n-menu--collapsed {
  .n-menu-item-content {
    padding-left: 20px !important;
  }
}
</style> 