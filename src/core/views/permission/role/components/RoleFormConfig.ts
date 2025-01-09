import { ref, h, watch } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui'
import { permissionMenus } from '../../../../permissions-config/treeGenerator'
import { buttonPermissionMap } from '../../../../permissions-config/buttonMap'
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
      children: menu.children ? transformMenuToTree(menu.children, checkedKeys, isViewMode, handlePermissionChange) : [],
      isLeaf: !hasChildren,
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
                    label: buttonPermissionMap[permission as keyof typeof buttonPermissionMap] || permission,
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

// 根据选中的 keys 更新表单权限数据
export const updateFormPermissions = (checkedKeys: string[]): RolePermission[] => {
  console.log('=== 更新表单权限数据 ===')
  console.log('选中的 keys:', checkedKeys)

  // 创建一个映射，用于存储每个菜单的权限
  const menuPermissions = new Map<string, string[]>()
  
  // 收集所有权限
  checkedKeys.forEach(key => {
    if (isPermissionKey(key)) {
      const parts = key.split('-')
      const permission = parts.pop()
      const menuKey = parts.join('-')
      if (permission && menuKey) {
        const perms = menuPermissions.get(menuKey) || []
        perms.push(permission)
        menuPermissions.set(menuKey, perms)
      }
    }
  })

  // 递归更新权限树
  const updateMenus = (menus: RolePermission[]): RolePermission[] => {
    return menus.map(menu => {
      const isChecked = checkedKeys.includes(menu.key)
      const permissions = menuPermissions.get(menu.key) || []
      
      console.log(`处理菜单 ${menu.key}:`)
      console.log('- 是否选中:', isChecked)
      console.log('- 权限列表:', permissions)

      const result: RolePermission = {
        ...menu,
        isChecked,
        permissions: isChecked ? permissions : [],
        children: menu.children ? updateMenus(menu.children) : undefined
      }

      console.log('- 更新结果:', result)
      return result
    })
  }

  const result = updateMenus(permissionMenus)
  console.log('更新后的权限树:', JSON.stringify(result, null, 2))
  return result
}

// 生成初始选中keys
export const generateCheckedKeys = (permissions: RolePermission[]): string[] => {
  let keys: string[] = []
  permissions.forEach(item => {
    // 添加菜单节点（如果被选中）
    if (item.isChecked) {
      // 添加菜单节点
      keys.push(item.id)
      
      // 只有当菜单被选中时，才添加其权限
      if (item.permissions.length > 0) {
        keys.push(...item.permissions.map((p: string) => `${item.id}-${p}`))
      }
    }
    
    // 递归处理子菜单
    if (item.children?.length) {
      keys.push(...generateCheckedKeys(item.children))
    }
  })
  return keys
}

// 检查是否所有权限都被选中
const checkIfAllPermissionsSelected = (checkedKeys: string[], menus: RolePermission[]): boolean => {
  const allPermissionKeys = new Set<string>()
  const selectedPermissionKeys = new Set<string>()

  // 收集所有可能的权限keys
  const collectAllPermissions = (items: RolePermission[]) => {
    items.forEach(menu => {
      if (menu.permissions && menu.permissions.length > 0) {
        menu.permissions.forEach(permission => {
          allPermissionKeys.add(`${menu.id}-${permission}`)
        })
      }
      if (menu.children) {
        collectAllPermissions(menu.children)
      }
    })
  }

  // 收集选中的权限keys
  checkedKeys.forEach(key => {
    if (isPermissionKey(key)) {
      selectedPermissionKeys.add(key)
    }
  })

  collectAllPermissions(menus)

  // 检查是否所有权限都被选中
  return Array.from(allPermissionKeys).every(key => selectedPermissionKeys.has(key))
}

// 合并新旧权限树
export const mergePermissionTree = (latestTree: RolePermission[], oldTree: RolePermission[]): RolePermission[] => {
  console.log('=== 合并权限树 ===')
  console.log('最新权限树:', JSON.stringify(latestTree, null, 2))
  console.log('旧权限树:', JSON.stringify(oldTree, null, 2))

  // 创建一个映射，用于快速查找旧菜单的选中状态
  const oldMenuMap = new Map<string, RolePermission>()
  const buildMenuMap = (menus: RolePermission[]) => {
    menus.forEach(menu => {
      oldMenuMap.set(menu.key, menu)
      if (menu.children) {
        buildMenuMap(menu.children)
      }
    })
  }
  buildMenuMap(oldTree)

  // 递归合并菜单树
  const mergeMenus = (menus: RolePermission[]): RolePermission[] => {
    return menus.map(menu => {
      const oldMenu = oldMenuMap.get(menu.key)
      console.log(`处理菜单 ${menu.key}:`)
      console.log('- 当前菜单:', menu)
      console.log('- 旧菜单:', oldMenu)

      // 如果找到对应的旧菜单，保留其选中状态和权限
      const result: RolePermission = {
        ...menu,
        isChecked: oldMenu?.isChecked ?? false,
        permissions: oldMenu?.isChecked ? oldMenu.permissions.filter(perm => menu.permissions.includes(perm)) : [],
        children: menu.children ? mergeMenus(menu.children) : undefined
      }

      console.log('- 合并结果:', result)
      return result
    })
  }

  const result = mergeMenus(latestTree)
  console.log('合并后的权限树:', JSON.stringify(result, null, 2))
  return result
}

// 定义变更信息接口
export interface PermissionChanges {
  hasChanges: boolean;
  removedPermissions: Array<{
    menuName: string;
    permissions: string[];
  }>;
  nameChanges: Array<{
    key: string;
    oldName: string;
    newName: string;
  }>;
}

// 检查权限配置是否有变更
export const checkPermissionChanges = (latestTree: RolePermission[], oldTree: RolePermission[]): PermissionChanges => {
  // console.log('=== 检查权限变更 ===')
  // console.log('最新权限树:', JSON.stringify(latestTree, null, 2))
  // console.log('旧权限树:', JSON.stringify(oldTree, null, 2))

  const changes: PermissionChanges = {
    hasChanges: false,
    removedPermissions: [],
    nameChanges: []
  }

  // 创建一个映射，用于快速查找旧菜单的权限
  const oldMenuMap = new Map<string, RolePermission>()
  const buildMenuMap = (menus: RolePermission[]) => {
    menus.forEach(menu => {
      // 只记录 isChecked 为 true 的菜单
      if (menu.isChecked) {
        oldMenuMap.set(menu.key, menu)
      }
      if (menu.children) {
        buildMenuMap(menu.children)
      }
    })
  }
  buildMenuMap(oldTree)

  // 递归检查权限变更
  const checkMenuChanges = (menus: RolePermission[]) => {
    menus.forEach(menu => {
      const oldMenu = oldMenuMap.get(menu.key)
      // console.log(`检查菜单 ${menu.key}:`)
      // console.log('- 当前菜单:', menu)
      // console.log('- 旧菜单:', oldMenu)
      
      if (oldMenu) {
        // 只有当旧菜单是选中状态时，才检查名称变更
        if (oldMenu.isChecked && oldMenu.name !== menu.name) {
          console.log('- 发现名称变更:', { old: oldMenu.name, new: menu.name })
          changes.hasChanges = true
          changes.nameChanges.push({
            key: menu.key,
            oldName: oldMenu.name,
            newName: menu.name
          })
        }

        // 检查权限是否被移除（只检查旧菜单中存在的权限）
        const removedPerms = oldMenu.permissions.filter(
          perm => !menu.permissions.includes(perm)
        )
        
        if (removedPerms.length > 0) {
          console.log('- 发现被移除的权限:', removedPerms)
          changes.hasChanges = true
          changes.removedPermissions.push({
            menuName: menu.name,
            permissions: removedPerms
          })
        }
      }

      // 递归检查子菜单
      if (menu.children) {
        checkMenuChanges(menu.children)
      }
    })
  }

  checkMenuChanges(latestTree)
  // console.log('检查结果:', changes)
  return changes
}

export const useRoleTree = () => {
  const expandedKeys = ref<string[]>([])
  const checkedKeys = ref<string[]>([])
  const treeData = ref<TreeOption[]>([])
  const checkAll = ref(false) // 修改默认值为 false
  const checkAllPermissions = ref(false)

  // 监听 checkedKeys 变化，更新 checkAll 和 checkAllPermissions 状态
  watch(checkedKeys, (newKeys) => {
    const menuKeys = newKeys.filter(key => !isPermissionKey(key))
    const allMenuIds = getAllMenuIds(permissionMenus)
    checkAll.value = allMenuIds.every(id => menuKeys.includes(id))
    checkAllPermissions.value = checkIfAllPermissionsSelected(newKeys, permissionMenus)
  })

  // 获取所有菜单ID（包括子菜单）
  const getAllMenuIds = (menus: RolePermission[]): string[] => {
    const ids: string[] = []
    menus.forEach(menu => {
      ids.push(menu.id)
      if (menu.children) {
        ids.push(...getAllMenuIds(menu.children))
      }
    })
    return ids
  }

  // 处理全选开关变化
  const handleCheckAllChange = (checked: boolean, updateFormData: (permissions: RolePermission[]) => void) => {
    checkAll.value = checked
    if (checked) {
      // 获取所有菜单ID
      const allMenuIds = getAllMenuIds(permissionMenus)
      // 更新选中状态
      checkedKeys.value = allMenuIds
      // 更新表单数据
      updateFormData(updateFormPermissions(checkedKeys.value))
    } else {
      // 清空选中状态
      checkedKeys.value = []
      // 更新表单数据
      updateFormData(updateFormPermissions([]))
    }
  }

  // 处理展开/收起
  const handleUpdateExpanded = (keys: string[]) => {
    expandedKeys.value = keys
  }

  // 处理选中状态变化
  const handleUpdateChecked = (keys: string[], updateFormData: (permissions: RolePermission[]) => void) => {
    // 获取当前所有的权限keys
    let currentPermissionKeys = checkedKeys.value.filter(isPermissionKey)
    // 获取的菜单keys
    const menuKeys = keys.filter(key => !isPermissionKey(key))

    // 递归获取所有子菜单ID
    const getAllChildrenIds = (menu: RolePermission): string[] => {
      const ids: string[] = [menu.id]
      if (menu.children) {
        menu.children.forEach(child => {
          ids.push(...getAllChildrenIds(child))
        })
      }
      return ids
    }

    // 递归查找菜单
    const findMenu = (menus: RolePermission[], targetId: string): RolePermission | null => {
      for (const menu of menus) {
        if (menu.id === targetId) {
          return menu
        }
        if (menu.children) {
          const found = findMenu(menu.children, targetId)
          if (found) {
            return found
          }
        }
      }
      return null
    }

    // 递归获取所有父级菜单ID
    const getAllParentIds = (menus: RolePermission[], targetId: string): string[] => {
      for (const menu of menus) {
        if (menu.id === targetId) {
          return []
        }
        if (menu.children) {
          for (const child of menu.children) {
            if (child.id === targetId) {
              return [menu.id]
            }
            const parentIds = getAllParentIds([child], targetId)
            if (parentIds.length > 0) {
              return [menu.id, ...parentIds]
            }
          }
        }
      }
      return []
    }

    // 获取所有需要移除的ID（包括子菜单）
    const getAllRemoveIds = (keys: string[]): string[] => {
      return keys.reduce((acc: string[], key) => {
        const menu = findMenu(permissionMenus, key)
        if (menu) {
          acc.push(...getAllChildrenIds(menu))
        }
        return acc
      }, [])
    }

    // 处理新增的选中项
    const addedKeys = keys.filter(key => !checkedKeys.value.includes(key))
    const removedKeys = checkedKeys.value.filter(key => !keys.includes(key))

    // 获取所有需要移除的ID
    const allRemoveIds = getAllRemoveIds(removedKeys)

    // 从当前选中的keys中移除所有需要移除的ID
    let newMenuKeys = menuKeys.filter(key => !allRemoveIds.includes(key))

    // 处理新增选中
    addedKeys.forEach(key => {
      // 添加父级菜单
      const parentIds = getAllParentIds(permissionMenus, key)
      newMenuKeys.push(...parentIds)
      
      // 如果是菜单，添加所有子菜单
      const menu = findMenu(permissionMenus, key)
      if (menu) {
        newMenuKeys.push(...getAllChildrenIds(menu))
      }
    })

    // 去重
    newMenuKeys = [...new Set(newMenuKeys)]

    // 从权限keys中移除所有相关权限
    currentPermissionKeys = currentPermissionKeys.filter(permKey => {
      const menuId = permKey.split('-').slice(0, -1).join('-')
      return !allRemoveIds.includes(menuId)
    })

    // 只保留被选中菜单的权限
    const validPermissionKeys = currentPermissionKeys.filter(permKey => {
      const menuId = permKey.split('-').slice(0, -1).join('-')
      return newMenuKeys.includes(menuId)
    })
    
    // 更新选中的keys
    checkedKeys.value = [...newMenuKeys, ...validPermissionKeys]
    // 更新表单数据中的权限
    updateFormData(updateFormPermissions(checkedKeys.value))

    // 更新全选状态
    const allMenuIds = getAllMenuIds(permissionMenus)
    checkAll.value = allMenuIds.every(id => newMenuKeys.includes(id))
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
      
      // 如果是子菜单权限变更，确保所有父菜单也被选中
      const menuIdParts = menuId.split('-')
      let parentId = ''
      for (let i = 0; i < menuIdParts.length - 1; i++) {
        parentId = parentId ? `${parentId}-${menuIdParts[i]}` : menuIdParts[i]
        if (!otherKeys.includes(parentId)) {
          otherKeys.push(parentId)
        }
      }
    }
    
    // 更新选中的keys，保留其他菜单的所有key
    checkedKeys.value = [...otherKeys, ...newPermissionKeys]
    
    // 更新表单数据中的权限
    updateFormData(updateFormPermissions(checkedKeys.value))

    // 更新全选状态
    const allMenuIds = getAllMenuIds(permissionMenus)
    checkAll.value = allMenuIds.every(id => otherKeys.includes(id))
  }

  // 获取所有可用的权限keys
  const getAllPermissionKeys = (menus: RolePermission[]): string[] => {
    const keys: string[] = []
    const collect = (items: RolePermission[]) => {
      items.forEach(menu => {
        if (menu.permissions && menu.permissions.length > 0) {
          menu.permissions.forEach(permission => {
            keys.push(`${menu.id}-${permission}`)
          })
        }
        if (menu.children) {
          collect(menu.children)
        }
      })
    }
    collect(menus)
    return keys
  }

  // 处理功能权限全选开关变化
  const handleCheckAllPermissionsChange = (checked: boolean, updateFormData: (permissions: RolePermission[]) => void) => {
    checkAllPermissions.value = checked
    if (checked && checkAll.value) {
      // 获取所有菜单ID和权限
      const allMenuIds = getAllMenuIds(permissionMenus)
      const allPermissionKeys = getAllPermissionKeys(permissionMenus)
      // 更新选中状态
      checkedKeys.value = [...allMenuIds, ...allPermissionKeys]
      // 更新表单数据
      updateFormData(updateFormPermissions(checkedKeys.value))
    } else {
      // 只保留菜单的选中状态，移除所有权限
      const menuKeys = checkedKeys.value.filter(key => !isPermissionKey(key))
      checkedKeys.value = menuKeys
      // 更新表单数据
      updateFormData(updateFormPermissions(checkedKeys.value))
    }
  }

  // 初始化时，如果是全选状态，需要手动触发一次全选逻辑
  const initializeFormData = (updateFormData: (permissions: RolePermission[]) => void) => {
    if (checkAll.value) {
      const allMenuIds = getAllMenuIds(permissionMenus)
      checkedKeys.value = allMenuIds
      updateFormData(updateFormPermissions(allMenuIds))
    }
  }

  return {
    expandedKeys,
    checkedKeys,
    treeData,
    checkAll,
    checkAllPermissions,
    handleUpdateExpanded,
    handleUpdateChecked,
    handlePermissionChange,
    handleCheckAllChange,
    handleCheckAllPermissionsChange,
    initializeFormData
  }
} 