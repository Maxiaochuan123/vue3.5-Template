<template>
  <div class="logo-container">
    <img 
      src="https://file.moujiang.com/%E7%B4%A0%E6%9D%90/logo.png" 
      alt="谋将Logo" 
      class="company-logo"
      :class="{ 'collapsed': collapsed }"
    />
    <div class="company-name" :class="{ 'collapsed': collapsed }">广告联盟平台</div>
  </div>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'

defineProps<{
  collapsed: boolean
}>()

const themeVars = useThemeVars()
</script>

<style scoped lang="less">
.logo-container {
  padding-top: 16px;
  text-align: center;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s;

  &.collapsed {
    width: 32px;
    height: 32px;
    border-radius: 0;
    margin-bottom: 0;
  }
}

.company-name {
  font-size: 14px;
  color: v-bind('themeVars.textColor2');
  line-height: 1.5;
  width: 176px;
  margin: 0 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &.collapsed {
    opacity: 0;
    transform: scale(0.5);
    width: 0;
    height: 0;
    position: absolute;
    margin: 0;
  }
}
</style> 