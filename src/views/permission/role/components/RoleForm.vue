<script setup lang="ts">
import { ref, watch, computed, inject, toRef, reactive, onMounted, h } from 'vue'
import type { Ref } from 'vue'
import { NForm, NFormItem, NInput, NTree, NScrollbar, NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui'
import type { FormInst, FormRules, TreeOption } from 'naive-ui'
import { permissionMenus, permissionMap } from '@/permissions'

export interface FormState {
  name: string
  permissions: string[]
}

// 注入响应式的 formType 和 editData
const formType = inject<Ref<'add' | 'edit' | 'view'>>('formType')!
const editData = inject<Ref<Partial<FormState>>>('editData')!

const formRef = ref<FormInst | null>(null)
const formData = reactive<FormState>({
  name: '',
  permissions: []
})

// 是否为查看模式
const isViewMode = computed(() => formType.value === 'view')

// 将权限菜单转换为树形结构
const transformMenuToTree = (menus: typeof permissionMenus, parentId: string = ''): TreeOption[] => {
  return menus.map(menu => {
    // 生成当前节点的完整ID
    const currentId = menu.id
    const hasChildren = !!(menu.children && menu.children.length > 0)
    
    let node: TreeOption = {
      key: currentId,
      label: menu.name,
      children: hasChildren ? transformMenuToTree(menu.children) : undefined,
      suffix: () => {
        // 如果菜单有定义权限，就显示权限按钮
        if (menu.permissions && Array.isArray(menu.permissions)) {
          // 获取当前菜单在 checkedKeys 中的权限
          const currentCheckedPermissions = checkedKeys.value
            .filter(key => {
              // 确保完全匹配当前菜单的权限key
              return key === `${currentId}-${key.split('-').pop()}`
            })
            .map(key => key.split('-').pop())
            .filter((key): key is string => key !== undefined)

          // 只有当有权限时才显示权限组
          if (menu.permissions.length > 0) {
            return h(NCheckboxGroup, {
              value: currentCheckedPermissions,
              disabled: isViewMode.value,
              onClick: (e: MouseEvent) => {
                e.stopPropagation()
              },
              "onUpdate:value": (values: (string | number)[]) => {
                handlePermissionChange(currentId, values)
              }
            }, {
              default: () => h(NSpace, { size: 12, onClick: (e: MouseEvent) => e.stopPropagation() }, () =>
                menu.permissions.map(permission =>
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

// 生成树形数据
const treeData = ref<TreeOption[]>(transformMenuToTree(permissionMenus))

// 获取所有可展开的节点key
const getAllExpandableKeys = (nodes: TreeOption[]): string[] => {
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

// 展开的节点keys
const expandedKeys = ref<string[]>([])

// 获取所有菜单节点的key（不包含操作按钮和空children的节点）
const getAllMenuKeys = (nodes: TreeOption[]): string[] => {
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

// 根据路径查找菜单
const findMenuByPath = (menus: typeof permissionMenus, path: string): (typeof permissionMenus)[0] | undefined => {
  if (!path) return undefined
  const parts = path.split('-')
  let currentMenus = menus
  let currentMenu: (typeof permissionMenus)[0] | undefined

  for (const part of parts) {
    currentMenu = currentMenus.find(menu => menu.id === part)
    if (!currentMenu) return undefined
    if (currentMenu.children) {
      currentMenus = currentMenu.children
    }
  }
  return currentMenu
}

// 判断是否为权限key
const isPermissionKey = (key: string): boolean => {
  const parts = key.split('-')
  const lastPart = parts.pop() // 最后一部分
  if (!lastPart) return false

  // 获取菜单ID
  const menuId = parts.join('-')
  
  // 递归查找菜单
  const findMenu = (menus: typeof permissionMenus): boolean => {
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

// 默认选中的节点
const checkedKeys = ref<string[]>([])

// 初始化展开和选中状态
onMounted(() => {
  // 设置展开的节点
  expandedKeys.value = getAllExpandableKeys(treeData.value)
  // 新增时默认选中所有菜单节点，但不选中权限
  if (formType.value === 'add') {
    checkedKeys.value = getAllMenuKeys(treeData.value)
  }
})

// 监听编辑数据变化
watch(
  editData,
  (newData) => {
    if (newData) {
      formData.name = newData.name ?? ''
      
      // 递归处理权限数据，生成完整的 checkedKeys
      const generateCheckedKeys = (permissions: any[]): string[] => {
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

      // 设置初始权限数据
      formData.permissions = Array.isArray(newData.permissions) ? newData.permissions : []
      // 设置选中状态
      checkedKeys.value = Array.isArray(newData.permissions) ? generateCheckedKeys(newData.permissions) : []
      
      // 调试输出
      console.log('Edit Data:', newData)
      console.log('Generated Checked Keys:', checkedKeys.value)
    }
  },
  { immediate: true }
)

const rules: FormRules = {
  name: [
    { required: false, message: '请输入角色名称' },
  ]
}

// 处理展开/收起
const handleUpdateExpanded = (keys: string[]) => {
  expandedKeys.value = keys
}

// 获取节点的所有限
const getNodePermissions = (nodeId: string): string[] => {
  const findNode = (nodes: typeof permissionMenus): typeof permissionMenus[0] | undefined => {
    for (const node of nodes) {
      if (node.id === nodeId) return node
      if (node.children) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
  }
  const node = findNode(permissionMenus)
  return node?.permissions || []
}

// 处理选中状态变化
const handleUpdateChecked = (keys: string[]) => {
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
  updateFormPermissions(checkedKeys.value)
}

// 处理权限复选框变化
const handlePermissionChange = (menuId: string, values: (string | number)[]) => {
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
  
  // 更新选中的keys，保留其他菜单的��有key
  checkedKeys.value = [...otherKeys, ...newPermissionKeys]
  
  // 更新表单数据中的权限
  updateFormPermissions(checkedKeys.value)
}

// 在权限菜单中查找对应的菜单项和其原始ID
const findMenuWithOriginalId = (menus: typeof permissionMenus, targetId: string): { menu: any, originalId: string } | null => {
  for (const menu of menus) {
    if (menu.id === targetId) {
      return { menu, originalId: targetId }
    }
    if (menu.children) {
      // 检查子菜单中是否包含目标ID（作为子ID的一部分）
      for (const child of menu.children) {
        const childFullId = `${menu.id}-${child.id}`
        if (targetId === childFullId) {
          return { menu: child, originalId: childFullId }
        }
      }
      // 如果在直接子菜单中没有找到，继续递归查找
      const found = findMenuWithOriginalId(menu.children, targetId)
      if (found) return found
    }
  }
  return null
}

// 更新表单权限数据
const updateFormPermissions = (keys: string[]) => {
  // 分别获取菜单keys和权限keys
  const menuKeys = keys.filter(key => !isPermissionKey(key))
  const permissionKeys = keys.filter(isPermissionKey)

  // 递归处理菜单树
  const processMenuTree = (menus: typeof permissionMenus): any[] => {
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
        children // 始终返回数组，即使是空数组
      }
    }).filter(item => {
      return item.isChecked || 
             item.permissions.length > 0 || 
             (item.children && item.children.some(child => 
               child.isChecked || child.permissions.length > 0 || (child.children && child.children.length > 0)
             ))
    })
  }

  // 更新表单数据
  formData.permissions = processMenuTree(permissionMenus)
}

// 表单验证
const validate = async () => {
  try {
    await formRef.value?.validate()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

defineExpose({
  validate,
  formData
})
</script>

<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="100"
    require-mark-placement="right-hanging"
    :disabled="isViewMode"
  >
    <NFormItem label="角色名称" path="name">
      <NInput v-model:value="formData.name" placeholder="请输入角色名称" />
    </NFormItem>
    
    <NFormItem label="权限配置">
      <NScrollbar style="max-height: 400px">
        <div class="tree-container">
          <NTree
            block-line
            checkable
            :data="treeData"
            :checked-keys="checkedKeys"
            :expanded-keys="expandedKeys"
            :disabled="isViewMode"
            :show-irrelevant-nodes="false"
            @update:checked-keys="handleUpdateChecked"
            @update:expanded-keys="handleUpdateExpanded"
          />
        </div>
      </NScrollbar>
    </NFormItem>
  </NForm>
</template>

<style scoped>
.n-scrollbar {
  border: 1px solid #eee;
  border-radius: 3px;
}

.tree-container {
  /* min-width: 600px; */
  padding: 8px;
}

:deep(.n-checkbox-group) {
  display: flex;
  align-items: center;
  margin-left: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

:deep(.n-tree .n-tree-node-content) {
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.n-tree .n-tree-node-content__suffix) {
  position: relative;
  flex: none;
  margin-left: 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

:deep(.n-space) {
  display: flex !important;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px !important;
}

:deep(.n-checkbox) {
  display: flex;
  align-items: center;
  margin-right: 0 !important;
}

:deep(.n-tree-node-content__text) {
  flex: none;
  white-space: nowrap;
  /* background-color: antiquewhite; */
}

:deep(.n-tree-node) {
  width: 100%;
}
</style> 