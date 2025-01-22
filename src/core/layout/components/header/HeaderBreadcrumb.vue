<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="item in items"
      :key="item.path"
      @click="() => handleClick(item)"
    >
      {{ item.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import type { CustomRouteMeta } from '../../composables'

interface BreadcrumbItem {
  title: string
  path: string
}

const route = useRoute()
const router = useRouter()

const items = computed<BreadcrumbItem[]>(() => {
  return route.matched
    .filter(route => route.name !== 'Layout' && !route.path.includes('add-editor'))
    .map(route => {
      const meta = route.meta as CustomRouteMeta
      return {
        title: meta.title,
        path: route.name === 'dashboard' ? '/' : route.path
      }
    })
})

const handleClick = (item: BreadcrumbItem) => {
  if (item.path === route.path) return
  router.push(item.path)
}
</script> 