<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed="isCollapse"
      :collapsed-width="64"
      :width="240"
      show-trigger
      @collapse="isCollapse = true"
      @expand="isCollapse = false"
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
import type { RouteRecordRaw } from 'vue-router'
import { MenuOutline, PersonOutline, LogOutOutline } from '@vicons/ionicons5'
import { NBreadcrumb, NBreadcrumbItem, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useAuthStore } from '@/core/stores/modules/auth'

interface CustomRouteMeta {
  title?: string
  icon?: any
  hideInMenu?: boolean
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isCollapse = ref(false)

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
  console.log('当前激活菜单:', activeMenu.value)
  console.log(
    '路由匹配:',
    route.matched.map((r) => ({ path: r.path, meta: r.meta })),
  )
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
  // console.log('查���权限:', { title, permissions })

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
  const permission = findPermission(authStore.auth.permissions, meta.title)

  // 如果没有找到权限配置或未被选中，则不显示
  if (!permission || !permission.isChecked) {
    return null
  }

  // 构建完整路径
  const fullPath = parentPath + (route.path.startsWith('/') ? route.path : `/${route.path}`)

  const menuOption: MenuOption = {
    label: meta.title,
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
  // console.log('当前权限数据:', authStore.auth.permissions)

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

  console.log('最终生成的菜单:', result)
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

// 处理面包屑点击
const handleBreadcrumbClick = (item: { path: string; title: string }) => {
  if (item.path === route.path) return
  router.push(item.path)
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
