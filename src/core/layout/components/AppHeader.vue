<template>
  <n-layout-header bordered class="layout-header">
    <div class="header-content">
      <div class="header-left">
        <n-icon size="24" class="collapse-icon" @click="$emit('toggle-collapse')">
          <component :is="isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
        </n-icon>
        <header-breadcrumb />
      </div>
      <div class="header-right">
        <n-space align="center" :size="20">
          <theme-switch :mode="themeMode" @update:mode="handleThemeChange" />
          <user-dropdown />
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NIcon, NSpace } from 'naive-ui'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import { useTheme } from '../composables/useTheme'
import { useThemeVars } from 'naive-ui'
import HeaderBreadcrumb from './HeaderBreadcrumb.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import UserDropdown from './UserDropdown.vue'

defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  'toggle-collapse': []
}>()

const { themeMode, handleThemeChange } = useTheme()
const themeVars = useThemeVars()
</script>

<style scoped lang="less">
.layout-header {
  height: 64px;
  padding: 12px 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  cursor: pointer;
}

.collapse-icon {
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: v-bind('themeVars.primaryColor');
  }
}
</style> 