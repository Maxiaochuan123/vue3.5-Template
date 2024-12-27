import { ref, h } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui'
import { permissionMenus, permissionMap } from '@/core/permissions'
import type { RolePermission } from '@/core/api/modules/role'

// 将权限菜单转换为树形结构
export const transformMenuToTree = (
  menus: RolePermission[],
  checkedKeys: string[],
  isViewMode: boolean,
  handlePermissionChange: (menuId: string, values: (string | number)[]) => void
): TreeOption[] => {
  return menus.map(menu => {
    // 生成当前节点的完整ID
    const currentId = menu.id
    const hasChildren = !!(menu.children && menu.children.length > 0)
    
    let node: TreeOption = {
      key: currentId,
      label: menu.name,
      children: hasChildren && menu.children ? transformMenuToTree(menu.children, checkedKeys, isViewMode, handlePermissionChange) : undefined,
      suffix: () => {
        // 如果菜单有定义权限，就显示权限按钮
        if (menu.permissions && Array.isArray(menu.permissions)) {
          // 获取当前菜单在 checkedKeys 中的权限
          const currentCheckedPermissions = checkedKeys
            .filter(key => {
              // 确保完全匹配当前菜单的权限key
              return key === `${currentId}-${key.split('-').pop()}`
            })
            .map(key => key.split('-').pop())
            .filter((key): key is string => key !== undefined)

          // 只有当有权限时才显示权限组
          const permissions = menu.permissions || []
          if (permissions.length > 0) {
            return h(NCheckboxGroup, {
              value: currentCheckedPermissions,
              disabled: isViewMode,
              onClick: (e: MouseEvent) => {
                e.stopPropagation()
              },
              "onUpdate:value": (values: (string | number)[]) => {
                handlePermissionChange(currentId, values)
              }
            }, {
              default: () => h(NSpace, { size: 12, onClick: (e: MouseEvent) => e.stopPropagation() }, () =>
                permissions.map(permission =>
                  h(NCheckbox, {
                    key: `${currentId}-${permission}`,
                    value: permission,
                    label: permissionMap[permission as keyof typeof permissionMap] || permission,
                    style: {
                      marginRight: 0
                    },
                    onClick: (e: MouseEvent) => e.stopPropagation()
                  })
                )
              )
            })
          }
        }
        return null
      }
    }

    return node
  })
}

// 获取所有可展开的节点key
export const getAllExpandableKeys = (nodes: TreeOption[]): string[] => {
  const keys: string[] = []
  const collect = (items: TreeOption[]) => {
    items.forEach(node => {
      if (node.children) {
        keys.push(node.key as string)
        collect(node.children)
      }
    })
  }
  collect(nodes)
  return keys
}

// 获取所有菜单节点的key（不包含操作按钮和空children的节点）
export const getAllMenuKeys = (nodes: TreeOption[]): string[] => {
  const keys: string[] = []
  const collect = (items: TreeOption[]) => {
    items.forEach(node => {
      const key = node.key as string
      keys.push(key)
      if (node.children) {
        collect(node.children)
      }
    })
  }
  collect(nodes)
  return keys
}

// 判断是否为权限key
export const isPermissionKey = (key: string): boolean => {
  const parts = key.split('-')
  const lastPart = parts.pop() // 最后一部分
  if (!lastPart) return false

  // 获取菜单ID
  const menuId = parts.join('-')
  
  // 递归查找菜单
  const findMenu = (menus: RolePermission[]): boolean => {
    for (const menu of menus) {
      // 检查当前
      if (menu.id === menuId && menu.permissions?.includes(lastPart)) {
        return true
      }
      
      // 检查子菜单
      if (menu.children) {
        if (findMenu(menu.children)) {
          return true
        }
      }
    }
    return false
  }

  return findMenu(permissionMenus)
}

// 更新表单权限数据
export const updateFormPermissions = (keys: string[]): RolePermission[] => {
  // 分别获取菜单keys和权限keys
  const menuKeys = keys.filter(key => !isPermissionKey(key))
  const permissionKeys = keys.filter(isPermissionKey)

  // 递归处理菜单树
  const processMenuTree = (menus: RolePermission[]): RolePermission[] => {
    return menus.map(menu => {
      const isChecked = menuKeys.includes(menu.id)
      
      // 获取当前菜单的权限
      const currentPermissions = permissionKeys
        .filter(key => {
          const parts = key.split('-')
          const permission = parts.pop() // 最后一部分是权限
          const menuId = parts.join('-') // 剩余部分是菜单ID
          return menuId === menu.id
        })
        .map(key => key.split('-').pop())
        .filter((p): p is string => !!p)

      // 递归处理子菜单
      const children = menu.children ? processMenuTree(menu.children) : []

      return {
        id: menu.id,
        name: menu.name,
        isChecked,
        permissions: currentPermissions,
        children: children.length > 0 ? children : undefined
      }
    }).filter(item => {
      return item.isChecked || 
             (item.permissions?.length ?? 0) > 0 || 
             (item.children && item.children.some(child => 
               child.isChecked || 
               (child.permissions?.length ?? 0) > 0 || 
               (child.children && child.children.length > 0)
             ))
    })
  }

  return processMenuTree(permissionMenus)
}

// 生成初始选中的keys
export const generateCheckedKeys = (permissions: RolePermission[]): string[] => {
  let keys: string[] = []
  permissions.forEach(item => {
    // 添加菜单节点（如果被选中）
    if (item.isChecked) {
      keys.push(item.id)
    }
    
    // 添加权限
    if (item.permissions.length > 0) {
      keys.push(...item.permissions.map((p: string) => `${item.id}-${p}`))
    }
    
    // 递归处理子菜单
    if (item.children?.length) {
      keys.push(...generateCheckedKeys(item.children))
    }
  })
  return keys
}

export const useRoleTree = () => {
  const expandedKeys = ref<string[]>([])
  const checkedKeys = ref<string[]>([])
  const treeData = ref<TreeOption[]>([])

  // 处理展开/收起
  const handleUpdateExpanded = (keys: string[]) => {
    expandedKeys.value = keys
  }

  // 处理选中状态变化
  const handleUpdateChecked = (keys: string[], updateFormData: (permissions: RolePermission[]) => void) => {
    // 获取当前所有的权限keys
    const currentPermissionKeys = checkedKeys.value.filter(isPermissionKey)
    // 获取的菜单keys
    const menuKeys = keys.filter(key => !isPermissionKey(key))
    
    // 只保留被选中菜单的权限
    const validPermissionKeys = currentPermissionKeys.filter(permKey => {
      const menuId = permKey.split('-').slice(0, -1).join('-')
      return menuKeys.includes(menuId)
    })
    
    // 更新选中的keys
    checkedKeys.value = [...menuKeys, ...validPermissionKeys]
    // 更新表单数据中的权限
    updateFormData(updateFormPermissions(checkedKeys.value))
  }

  // 处理权限复选框变化
  const handlePermissionChange = (menuId: string, values: (string | number)[], updateFormData: (permissions: RolePermission[]) => void) => {
    // 先移除当前菜单的权限，保留其他菜单的所有key
    const otherKeys = checkedKeys.value.filter(key => !key.startsWith(`${menuId}-`))
    // 添加新选中的权限
    const newPermissionKeys = values.map(value => `${menuId}-${value}`)
    
    // 确保当前菜单被选中
    if (newPermissionKeys.length > 0 && !otherKeys.includes(menuId)) {
      otherKeys.push(menuId)
    }
    
    // 如果是子菜单的权限变更，确保父菜单也被选中
    const menuIdParts = menuId.split('-')
    if (menuIdParts.length > 1) {
      const parentId = menuIdParts.slice(0, -1).join('-')
      if (newPermissionKeys.length > 0 && !otherKeys.includes(parentId)) {
        otherKeys.push(parentId)
      }
    }
    
    // 更新选中的keys，保留其他菜单的所有key
    checkedKeys.value = [...otherKeys, ...newPermissionKeys]
    
    // 更新表单数据中的权限
    updateFormData(updateFormPermissions(checkedKeys.value))
  }

  return {
    expandedKeys,
    checkedKeys,
    treeData,
    handleUpdateExpanded,
    handleUpdateChecked,
    handlePermissionChange
  }
} 