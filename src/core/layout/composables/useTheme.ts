import { computed } from 'vue'
import { useSystemConfigStore } from '@/core/stores/modules/systemConfig'
import { useThemeVars } from 'naive-ui'

export type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  const systemConfigStore = useSystemConfigStore()
  const themeVars = useThemeVars()

  const handleThemeChange = (mode: ThemeMode) => {
    systemConfigStore.themeMode = mode
  }

  return {
    themeMode: computed(() => systemConfigStore.themeMode),
    themeVars,
    handleThemeChange
  }
} 