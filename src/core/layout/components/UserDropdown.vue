<template>
  <n-dropdown :options="userOptions" @select="handleSelect">
    <n-avatar
      round
      size="small"
      src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
  </n-dropdown>
</template>

<script setup lang="ts">
import { NDropdown, NAvatar } from 'naive-ui'
import { LogoutOutlined } from '@vicons/antd'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/stores/modules/auth'
import { useMenu } from '../composables/useMenu'

const router = useRouter()
const authStore = useAuthStore()
const { renderIcon } = useMenu()

const userOptions = [
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutOutlined),
  },
]

const handleSelect = (key: string) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script> 