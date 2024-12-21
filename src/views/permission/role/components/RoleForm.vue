<script setup lang="ts">
import { ref, watch, computed, inject, toRef, reactive, onMounted, h } from 'vue'
import type { Ref } from 'vue'
import { NForm, NFormItem, NInput, NTree, NScrollbar, NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui'
import type { FormInst, FormRules, TreeOption } from 'naive-ui'
import permissionMenus from '@/permissionConfig'

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

// 权限操作按钮映射
const permissionMap = {
  add: '新增',
  edit: '编辑',
  delete: '删除',
  view: '查看'
}

// 将权限菜单转换为树形结构
const transformMenuToTree = (menus: typeof permissionMenus, parentId: string = ''): TreeOption[] => {
  return menus.map(menu => {
    // 生成当前节点的完整ID
    const currentId = parentId ? `${parentId}-${menu.id}` : menu.id
    const hasChildren = !!(menu.children && menu.children.length > 0)
    const hasPermissions = !!(menu.permissions && menu.permissions.length > 0)
    
    let node: TreeOption = {
      key: currentId,
      label: menu.name,
      children: [],
      render: (info: { option: TreeOption }) => {
        return h('div', {
          class: 'tree-node-content'
        }, [
          // 如果有权限，显示展开箭头
          hasPermissions ? h('div', { class: 'expand-icon' }, [
            h('span', { class: 'arrow' }, '')
          ]) : null,
          // 节点标签
          h('span', menu.name),
          // 权限复选框组
          hasPermissions ? h(NCheckboxGroup, {
            value: checkedKeys.value
              .filter(key => key.startsWith(`${currentId}-`))
              .map(key => key.split('-').pop())
              .filter((key): key is string => key !== undefined),
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
                  value: permission,
                  label: permissionMap[permission as keyof typeof permissionMap],
                  style: {
                    marginRight: 0
                  },
                  onClick: (e: MouseEvent) => e.stopPropagation()
                })
              )
            )
          }) : null
        ])
      }
    }

    // 处理子菜单
    if (hasChildren) {
      node.children = transformMenuToTree(menu.children, currentId)
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
      if (node.children && node.children.length > 0) {
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

// 获取所有菜单节点的key（不包含操作按钮）
const getAllMenuKeys = (nodes: TreeOption[]): string[] => {
  const keys: string[] = []
  const collect = (items: TreeOption[]) => {
    items.forEach(node => {
      const key = node.key as string
      if (!key.split('-').pop()?.match(/^(add|edit|delete|view)$/)) {
        keys.push(key)
      }
      if (node.children) {
        collect(node.children)
      }
    })
  }
  collect(nodes)
  return keys
}

// 默认选中的节点
const checkedKeys = ref<string[]>([])

// 初始化展开和选中状态
onMounted(() => {
  // 设置展开的节点
  expandedKeys.value = getAllExpandableKeys(treeData.value)
  // 设置选中的节点（仅单，不包含操作按钮）
  checkedKeys.value = getAllMenuKeys(treeData.value)
})

// 监听编辑数据变化
watch(
  editData,
  (newData) => {
    if (newData) {
      Object.assign(formData, newData)
    }
  },
  { immediate: true }
)

const rules: FormRules = {
  name: [
    { required: true, message: '请输入角色名称' },
  ]
}

// 处理展开/收起
const handleUpdateExpanded = (keys: string[]) => {
  expandedKeys.value = keys
}

// 获取节点的所有权限
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
  // 找出新增和移除的菜单节点
  const addedKeys = keys.filter(key => !checkedKeys.value.includes(key))
  const removedKeys = checkedKeys.value.filter(key => !keys.includes(key))

  let finalKeys = [...keys]

  // 处理移除的菜单节点：同时移除其所有限
  removedKeys.forEach(key => {
    if (!key.match(/-(add|edit|delete|view)$/)) {
      finalKeys = finalKeys.filter(k => !k.startsWith(key))
    }
  })

  // 更新选中状态
  checkedKeys.value = finalKeys
  formData.permissions = finalKeys
}

// 处理权限复选框变化
const handlePermissionChange = (menuId: string, values: (string | number)[]) => {
  const otherKeys = checkedKeys.value.filter(key => !key.startsWith(`${menuId}-`))
  const newPermissionKeys = values.map(value => `${menuId}-${value}`)
  
  // 如果有权限被选中，确保菜单节点也被选中
  const newKeys = [...otherKeys, ...newPermissionKeys]
  if (values.length > 0 && !newKeys.includes(menuId)) {
    newKeys.push(menuId)
  }
  
  checkedKeys.value = newKeys
  formData.permissions = newKeys
}

defineExpose({
  formRef,
  formData,
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
          style="width: 600px"
        />
      </NScrollbar>
    </NFormItem>
  </NForm>
</template>

<style scoped>
.n-scrollbar {
  border: 1px solid #eee;
  border-radius: 3px;
}

:deep(.tree-node-content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
  width: 100%;
}

:deep(.n-checkbox-group) {
  display: flex;
  align-items: center;
}

:deep(.n-tree .n-tree-node-content) {
  padding: 4px 0;
}

:deep(.n-tree .n-tree-node-content__prefix) {
  flex: 1;
}
</style> 