<script setup lang="ts">
import { zhCN, dateZhCN, darkTheme, useOsTheme } from 'naive-ui'
import { computed } from 'vue'
import { useSystemConfigStore } from '@/core/stores/modules/systemConfig'

const systemConfigStore = useSystemConfigStore()

const osThemeRef = useOsTheme()

// 计算当前主题
const currentTheme = computed(() => {
  if (systemConfigStore.themeMode === 'system') {
    return osThemeRef.value === 'dark' ? darkTheme : null
  }
  return systemConfigStore.themeMode === 'dark' ? darkTheme : null
})

const themeOverrides = {
  common: {
    // primaryColor: '#B24592',
    // primaryColorHover: '#C85DA7',
    // primaryColorPressed: '#9B3B7C',
    // primaryColorSuppl: '#D972BE'
  }
}
</script>

<template>
  <n-config-provider 
    :locale="zhCN" 
    :date-locale="dateZhCN" 
    :theme="currentTheme"
    :theme-overrides="themeOverrides"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
