import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemConfigStore = defineStore('systemConfig', () => {
  // 创建主题状态
  const themeMode = ref<'light' | 'dark' | 'system'>('system')

  return {
    themeMode
  }
}, {
  persist: true
})

