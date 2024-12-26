import type { Directive } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

export const btnPermission: Directive = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const [permissionId, action] = binding.value

    // 在权限树中查找指定 id 的权限
    const findPermission = (permissions: any[]): any => {
      for (const item of permissions) {
        if (item.id === permissionId) return item
        if (item.children?.length) {
          const found = findPermission(item.children)
          if (found) return found
        }
      }
      return null
    }

    const permission = findPermission(authStore.auth.permissions)
    
    // 如果没有权限，移除元素
    if (!permission?.permissions?.includes(action)) {
      el.parentNode?.removeChild(el)
    }
  }
} 