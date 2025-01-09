<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'

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
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
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
