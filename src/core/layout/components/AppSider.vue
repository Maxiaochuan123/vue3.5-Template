<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed="collapsed"
    :collapsed-width="64"
    :width="240"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
    class="layout-sider"
  >
    <div class="sider-content">
      <div class="logo-wrapper">
        <app-logo :collapsed="collapsed" />
        <n-divider />
      </div>
      <div class="menu-wrapper">
        <app-menu v-model="activeMenuValue" :collapsed="collapsed" />
      </div>
    </div>
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

const collapsed = defineModel<boolean>({ default: false })

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

  .sider-content {
    height: 100%;
    padding-right: 2px;
    display: flex;
    flex-direction: column;
  }

  .logo-wrapper {
    flex-shrink: 0;

    .n-divider {
      margin: 9px 0;
    }
  }

  .menu-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
}
</style> 