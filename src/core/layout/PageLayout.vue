<template>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed="isCollapse"
        :collapsed-width="64"
        :width="240"
        show-trigger
        @collapse="(isCollapse = true)"
        @expand="(isCollapse = false)"
        class="layout-sider"
      >
        <n-menu
          :value="activeMenu"
          :collapsed="isCollapse"
          :options="menuOptions"
          :collapsed-width="64"
          @update:value="handleSelect"
        />
      </n-layout-sider>
  
      <n-layout>
        <n-layout-header bordered class="layout-header">
          <div class="header-content">
            <div class="header-left">
              <n-button quaternary circle @click="toggleCollapse">
                <template #icon>
                  <n-icon size="18">
                    <MenuOutline />
                  </n-icon>
                </template>
              </n-button>
              <n-breadcrumb>
                <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                  {{ item.title }}
                </n-breadcrumb-item>
              </n-breadcrumb>
            </div>
            <div class="header-right">
              <n-dropdown :options="userOptions" @select="handleUserAction">
                <n-avatar
                  round
                  size="small"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
              </n-dropdown>
            </div>
          </div>
        </n-layout-header>
  
        <n-layout-content class="layout-content">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </template>
  
  <script setup lang="ts">
  import { h, ref, computed, watch, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { MenuOutline, HomeOutline, LogOutOutline, WalletOutline } from '@vicons/ionicons5'
  import { NBreadcrumb, NBreadcrumbItem, NIcon } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  import { useAuthStore } from '@/stores/modules/auth'
  
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const isCollapse = ref(false)
  const activeMenu = ref(route.path)
  
  onMounted(() => {
    activeMenu.value = '/advertising-management'
    router.push('/advertising-management')
  })
  
  // 监听路由变化，更新菜单选中状态
  watch(
    () => route.path,
    (newPath) => {
      activeMenu.value = newPath
    },
  )
  
  function renderIcon(icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  
  const menuOptions: MenuOption[] = [
    {
      label: '首页',
      key: '/',
      icon: renderIcon(HomeOutline),
    },
    {
      label: '账户权益',
      key: '/account-equity',
      icon: renderIcon(WalletOutline),
    },
    {
      label: '广告管理',
      key: '/advertising-management',
      icon: renderIcon(MenuOutline),
    },
  ]
  
  // 面包屑导航
  const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched
    return matchedRoutes
      .filter((route) => {
        // 只过滤掉 layout 和 add-editor 路由
        const isLayout = route.name === 'Layout'
        const isAddEditor = route.path.includes('add-editor')
        return !isLayout && !isAddEditor
      })
      .map((route) => {
        // 如果是首页，特殊处理路径
        if (route.name === 'Dashboard') {
          return {
            title: route.meta.title,
            path: '/',
          }
        }
        return {
          title: route.meta.title,
          path: route.path,
        }
      })
  })
  
  const userOptions = [
    {
      label: '个人信息',
      key: 'profile',
      icon: renderIcon(MenuOutline),
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: renderIcon(LogOutOutline),
    },
  ]
  
  const handleSelect = (key: string) => {
    activeMenu.value = key
    router.push(key)
  }
  
  const handleUserAction = (key: string) => {
    if (key === 'logout') {
      authStore.logout()
      router.push('/login')
    }
  }
  
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  </script>
  
  <style scoped>
  .layout-sider {
    height: 100vh;
    border-right: 1px solid #eee;
  }
  
  .layout-header {
    height: 64px;
    padding: 12px 24px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
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
  
  .layout-content {
    background-color: #f5f7fa;
    min-height: calc(100vh - 64px);
  }
  
  :deep(.n-menu .n-menu-item-content) {
    margin: 4px 8px;
  }
  
  :deep(.n-layout-header) {
    background: #fff;
  }
  </style>
  