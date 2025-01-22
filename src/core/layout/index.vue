<template>
  <n-layout has-sider>
    <app-sider v-model:collapsed="isCollapse" />
    <n-layout class="layout-container">
      <app-header :is-collapsed="isCollapse" @toggle-collapse="toggleCollapse" />
      <n-layout-content class="layout-content">
        <!-- <transition name="fade-slide" mode="out-in">
          <router-view />
        </transition> -->

        <router-view v-slot="{ Component }">
          <component :is="Component" class="route-transition"/>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useDebounceFn } from '@vueuse/core'
import { useThemeVars } from 'naive-ui'
import { AppSider, AppHeader } from './components'

const isCollapse = ref(false)
const themeVars = useThemeVars()
// 添加防抖的窗口大小监听
const handleResize = useDebounceFn(() => {
  isCollapse.value = window.innerWidth <= 900
}, 50)

// 组件挂载时添加监听器
onMounted(() => {
  handleResize() // 初始化时执行一次
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleError = (error: Error) => {
  console.error(error)
}

// 处理折叠切换
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped lang="less">

.layout-container {
  min-width: 640px;
}

.layout-content {
  background-color: v-bind('themeVars.bodyColor');
  min-height: calc(100vh - 64px);
}

.route-transition {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0.4;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 路由过渡动画 - 缩放 */
// .fade-slide-enter-active {
//   transition: all 0.4s cubic-bezier(0.1, 0, 0.1, 1);
// }

// .fade-slide-leave-active {
//   transition: all 0.3s cubic-bezier(0.1, 0, 0.1, 1);
// }

// .fade-slide-enter-from {
//   opacity: 0;
//   transform: scale(0.98);
// }

// .fade-slide-leave-to {
//   opacity: 0;
//   transform: scale(0.98);
// }

/* 路由过渡动画 - 平移 */
/* .fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
} */
</style>
