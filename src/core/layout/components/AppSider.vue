<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed="collapsed"
    :collapsed-width="64"
    :width="240"
    show-trigger
    @collapse="$emit('update:collapsed', true)"
    @expand="$emit('update:collapsed', false)"
    class="layout-sider"
  >
    <app-logo :collapsed="collapsed" />
    <n-divider />
    <app-menu v-model="activeMenuValue" :collapsed="collapsed" />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NLayoutSider, NDivider } from 'naive-ui'
import { useThemeVars } from 'naive-ui'
import AppLogo from './AppLogo.vue'
import AppMenu from './AppMenu.vue'

const themeVars = useThemeVars()

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const route = useRoute()

const activeMenuValue = computed({
  get() {
    const currentRoute = route.matched.find((r) => r.meta?.hideInMenu)
    if (currentRoute) {
      const parentRoute = route.matched[route.matched.length - 2]
      return parentRoute ? parentRoute.path : route.path
    }
    return route.path
  },
  set(value: string) {
    // 这里不需要做任何事情，因为路由变化会自动更新计算属性
  }
})
</script>

<style scoped lang="less">
.layout-sider {
  height: 100vh;
  border-right: 1px solid v-bind('themeVars.borderColor');

  .n-divider {
    margin: 9px 0;
  }
}
</style> 