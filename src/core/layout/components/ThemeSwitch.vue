<template>
  <n-popover placement="bottom" trigger="click" :to="false">
    <template #trigger>
      <n-button text style="font-size: 20px">
        <n-icon>
          <component :is="currentIcon" />
        </n-icon>
      </n-button>
    </template>
    <div class="theme-options">
      <div
        v-for="option in themeOptions"
        :key="option.mode"
        class="theme-option"
        :class="{ active: mode === option.mode }"
        @click="$emit('update:mode', option.mode)"
      >
        <n-icon><component :is="option.icon" /></n-icon>
        <span>{{ option.label }}</span>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon, NPopover } from 'naive-ui'
import { useThemeVars } from 'naive-ui'
import { LightModeOutlined, DarkModeOutlined as Moon, ComputerOutlined as ComputerFilled } from '@vicons/material'
import type { ThemeMode } from '../composables'

const props = defineProps<{
  mode: ThemeMode
}>()

const emit = defineEmits<{
  'update:mode': [mode: ThemeMode]
}>()

const themeVars = useThemeVars()

const themeOptions = [
  { mode: 'light' as const, icon: LightModeOutlined, label: '明亮模式' },
  { mode: 'dark' as const, icon: Moon, label: '暗黑模式' },
  { mode: 'system' as const, icon: ComputerFilled, label: '跟随系统' }
]

const currentIcon = computed(() => {
  switch (props.mode) {
    case 'dark':
      return Moon
    case 'light':
      return LightModeOutlined
    default:
      return ComputerFilled
  }
})
</script>

<style lang="less">
.n-popover {
  padding: 6px 6px !important;
}

.theme-options {
  .theme-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    color: v-bind('themeVars.textColor2');

    &:hover {
      background-color: v-bind('themeVars.hoverColor');
    }

    &.active {
      color: v-bind('themeVars.primaryColor');
    }

    .n-icon {
      font-size: 18px;
    }
  }
}
</style> 