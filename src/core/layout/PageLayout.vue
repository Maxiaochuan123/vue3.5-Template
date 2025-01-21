<template>
  <n-layout has-sider>
    <n-layout-sider
      collapse-mode="width"
      :collapsed="isCollapse"
      :collapsed-width="64"
      :width="240"
      show-trigger
      @collapse="isCollapse = true"
      @expand="isCollapse = false"
      class="layout-sider"
    >
      <div class="logo-container">
        <img 
          src="https://file.moujiang.com/%E7%B4%A0%E6%9D%90/logo.png" 
          alt="谋将Logo" 
          class="company-logo"
          :class="{ 'collapsed': isCollapse }"
        />
        <div class="company-name" :class="{ 'collapsed': isCollapse }">谋将 - 广告联盟平台</div>
      </div>
      <n-divider />
      <n-menu
        :value="activeMenu"
        :collapsed="isCollapse"
        :options="menuOptions"
        :icon-size="24"
        @update:value="handleSelect"
        accordion
      />
    </n-layout-sider>

    <n-layout class="layout-container">
      <n-layout-header bordered class="layout-header">
        <div class="header-content">
          <div class="header-left">
            <n-icon size="24" class="collapse-icon" @click="toggleCollapse">
              <component :is="isCollapse ? MenuUnfoldOutlined : MenuFoldOutlined" />
            </n-icon>
            <n-breadcrumb>
              <n-breadcrumb-item
                v-for="item in breadcrumbs"
                :key="item.path"
                @click="() => handleBreadcrumbClick(item)"
              >
                {{ item.title }}
              </n-breadcrumb-item>
            </n-breadcrumb>
          </div>
          <div class="header-right">
            <n-space align="center" :size="20">
              <n-popover placement="bottom" :to="false">
                <template #trigger>
                  <n-button text style="font-size: 20px">
                    <n-icon>
                      <component :is="systemConfigStore.themeMode === 'dark' ? Moon : systemConfigStore.themeMode === 'light' ? LightModeOutlined : ComputerFilled" />
                    </n-icon>
                  </n-button>
                </template>
                <div class="theme-options">
                  <div
                    class="theme-option"
                    :class="{ active: systemConfigStore.themeMode === 'light' }"
                    @click="handleThemeChange('light')"
                  >
                    <n-icon><LightModeOutlined /></n-icon>
                    <span>明亮模式</span>
                  </div>
                  <div
                    class="theme-option"
                    :class="{ active: systemConfigStore.themeMode === 'dark' }"
                    @click="handleThemeChange('dark')"
                  >
                    <n-icon><Moon /></n-icon>
                    <span>暗黑模式</span>
                  </div>
                  <div
                    class="theme-option"
                    :class="{ active: systemConfigStore.themeMode === 'system' }"
                    @click="handleThemeChange('system')"
                  >
                    <n-icon><ComputerFilled /></n-icon>
                    <span>跟随系统</span>
                  </div>
                </div>
              </n-popover>
              <n-dropdown :options="userOptions" @select="handleUserAction">
                <n-avatar
                  round
                  size="small"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
              </n-dropdown>
            </n-space>
          </div>
        </div>
      </n-layout-header>

      <n-layout-content class="layout-content">
        <transition name="fade-slide" mode="out-in">
          <router-view />
        </transition>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { h, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@vicons/antd'
import { LightModeOutlined, DarkModeOutlined as Moon, ComputerOutlined as ComputerFilled } from '@vicons/material'
import { NBreadcrumb, NBreadcrumbItem, NIcon, NEllipsis, NSpace, NButton, NDropdown } from 'naive-ui'
import type { MenuOption, DropdownOption } from 'naive-ui'
import { useAuthStore } from '@/core/stores/modules/auth'
import { useThemeVars } from 'naive-ui'
import { useSystemConfigStore } from '@/core/stores/modules/systemConfig'

const themeVars = useThemeVars()

interface CustomRouteMeta {
  title?: string
  icon?: any
  hideInMenu?: boolean
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const systemConfigStore = useSystemConfigStore()
const isCollapse = ref(false)

// 添加窗口大小监听
const handleResize = () => {
  const windowWidth = window.innerWidth
  isCollapse.value = windowWidth <= 900
}

// 组件挂载时添加监听器
onMounted(() => {
  handleResize() // 初始化时执行一次
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const activeMenu = ref(route.path)

// 更新激活的菜单项
const updateActiveMenu = () => {
  // 如果当前路由是隐藏的（比如详情页），使用父级路由的路径
  const currentRoute = route.matched.find((r) => r.meta?.hideInMenu)
  if (currentRoute) {
    // 获取父级路由
    const parentRoute = route.matched[route.matched.length - 2]
    if (parentRoute) {
      // 使用完整的父级路径
      activeMenu.value = parentRoute.path.startsWith('/')
        ? parentRoute.path
        : `/${parentRoute.path}`
    }
  } else {
    activeMenu.value = route.path
  }
  // console.log('当前激活菜单:', activeMenu.value)
  // console.log(
  //   '路由匹配:',
  //   route.matched.map((r) => ({ path: r.path, meta: r.meta })),
  // )
}

// 初始化时设置激活菜单
updateActiveMenu()

// 监听路由变化，更新菜单选中状态
watch(() => route.fullPath, updateActiveMenu)

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 递归查找权限
const findPermission = (permissions: any[], title: string): any | null => {
  // console.log('查找权限:', { title, permissions })

  for (const permission of permissions) {
    // console.log('比较权限:', { permissionName: permission.name, searchTitle: title })

    if (permission.name === title) {
      // console.log('找到匹配权限:', permission)
      return permission
    }

    if (permission.children && permission.children.length > 0) {
      const found = findPermission(permission.children, title)
      if (found) {
        return found
      }
    }
  }

  // console.log('未找到匹配权限:', title)
  return null
}

// 根据路由和权限生成菜单
const generateMenuFromRoute = (route: RouteRecordRaw, parentPath = ''): MenuOption | null => {
  const meta = route.meta as CustomRouteMeta | undefined

  // 如果路由没有 meta 或 title，则不显示
  if (!meta?.title || meta.hideInMenu) {
    return null
  }

  // 查找对应的权限配置
  const permission = findPermission(authStore.permissions, meta.title)

  // 如果没有找到权限配置或未被选中，则不显示
  if (!permission || !permission.isChecked) {
    return null
  }

  // 构建完整路径
  const fullPath = parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`)

  const menuOption: MenuOption = {
    label: () => h(NEllipsis, null, { default: () => meta.title }),
    key: fullPath,
    icon: meta.icon ? renderIcon(meta.icon) : undefined,
  }

  // 如果有子路由，递归处理
  if (route.children) {
    const children = route.children
      .filter((child) => !child.meta?.hideInMenu) // 过滤掉隐藏的路由
      .map((child) => generateMenuFromRoute(child, fullPath))
      .filter(Boolean) as MenuOption[]

    if (children.length > 0) {
      menuOption.children = children
    }
  }

  return menuOption
}

// 计算菜单选项
const menuOptions = computed(() => {
  // console.log('开始生成菜单')
  // console.log('当前权限数据:', authStore.permissions)

  const layoutRoute = router.getRoutes().find((route) => route.name === 'Layout')
  if (!layoutRoute?.children) {
    // console.log('未找到 Layout 路由或其子路由')
    return []
  }

  // console.log('Layout 子路由:', layoutRoute.children.map(route => ({
  //   path: route.path,
  //   name: route.name,
  //   title: route.meta?.title
  // })))

  const result = layoutRoute.children
    .map((route) => {
      const menuOption = generateMenuFromRoute(route)
      // console.log(`处理路由 ${route.path}:`, menuOption)
      return menuOption
    })
    .filter(Boolean) as MenuOption[]

  // console.log('最终生成的菜单:', result)
  return result
})

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
      if (route.name === 'dashboard') {
        return {
          title: route.meta.title as string,
          path: '/',
        }
      }
      return {
        title: route.meta.title as string,
        path: route.path,
      }
    })
})

const userOptions = [
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutOutlined),
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

// 处理面包屑点击
const handleBreadcrumbClick = (item: { path: string; title: string }) => {
  if (item.path === route.path) return
  router.push(item.path)
}

// 处理主题切换
const handleThemeChange = (key: string) => {
  systemConfigStore.themeMode = key as 'light' | 'dark' | 'system'
}
</script>

<style scoped lang="less">
.layout-sider {
  height: 100vh;
  border-right: 1px solid v-bind('themeVars.borderColor');
}

.layout-container {
  min-width: 640px;
}

.layout-header {
  height: 64px;
  padding: 12px 24px;
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

.layout-content {
  background-color: v-bind('themeVars.bodyColor');
  min-height: calc(100vh - 64px);
}

.collapse-icon {
  cursor: pointer;
  transition: color 0.3s;
}

.collapse-icon:hover {
  color: v-bind('themeVars.primaryColor');
}

.logo-container {
  padding-top: 16px;
  text-align: center;
}

.n-divider{
  margin: 9px 0;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.company-logo.collapsed {
  width: 32px;
  height: 32px;
  border-radius: 0;
  margin-bottom: 0;
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
}

.company-name.collapsed {
  opacity: 0;
  transform: scale(0.5);
  width: 0;
  height: 0;
  position: absolute;
  margin: 0;
}

:deep(.n-menu.n-menu--collapsed) {
  .n-menu-item-content {
    padding-left: 20px !important;
  }
}

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

/* 路由过渡动画 - 缩放 */
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.1, 0, 0.1, 1);
}

.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.1, 0, 0.1, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.98);
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
