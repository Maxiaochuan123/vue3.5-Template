<script setup lang="ts">
import { ref, watch, computed, inject, onMounted, type Ref } from 'vue'
import { useRoleTree, transformMenuToTree, getAllExpandableKeys, getAllMenuKeys, generateCheckedKeys } from './RoleFormConfig'
import type { FormInst, FormRules } from 'naive-ui'
import { useDebounceFn } from '@vueuse/core'
import { permissionMenus } from '../../../../permissions-config/treeGenerator'
import { roleApi, type RolePermission, type RoleForm } from '@/core/api/modules/role'
import { useFormData } from '@/core/components/form/composables/useFormData'
import { type FormType } from '@/core/components/form/DrawerForm.vue'
import { useThemeVars } from 'naive-ui'

// 注入响应式的 formType 和 editData
const formType = inject<Ref<FormType>>('formType')!
const editData = inject<Ref<Partial<RoleForm>>>('editData')!

const formRef = ref<FormInst | null>(null)

const themeVars = useThemeVars()

const { formData, initialData } = useFormData<RoleForm>({
  initialData: {
    id: undefined,
    name: '',
    menuTree: []
  },
  editData
})

// 是否为查看模式
const isViewMode = computed(() => formType.value === 'view')

// 使用抽取出来的 tree 逻辑
const {
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
} = useRoleTree()

// 更新表单数据
const updateFormData = (menuTree: RolePermission[]) => {
  // console.log('=== 更新表单数据 ===')
  // console.log('新的菜单树:', JSON.stringify(menuTree, null, 2))
  
  // 深拷贝菜单树，避免引用问题
  formData.menuTree = JSON.parse(JSON.stringify(menuTree))
  
  // 更新树形数据
  updateTreeData()
}

// 更新树形数据
const updateTreeData = () => {
  // console.log('=== 更新树形数据 ===')
  // console.log('当前选中的 keys:', checkedKeys.value)
  // console.log('当前菜单树:', JSON.stringify(formData.menuTree, null, 2))
  
  treeData.value = transformMenuToTree(
    permissionMenus,
    checkedKeys.value,
    isViewMode.value,
    (menuId, values) => handlePermissionChange(menuId, values, updateFormData)
  )
}

// 初始化展开和选中状态
onMounted(() => {
  // 设置展开的节点
  expandedKeys.value = getAllExpandableKeys(treeData.value)
  // 新增时默认选中所有菜单节点，但不选中权限
  if (formType.value === 'add') {
    checkedKeys.value = getAllMenuKeys(treeData.value)
    // 初始化表单数据
    initializeFormData(updateFormData)
  }
  
  // 初始化树形数据
  updateTreeData()
})

// 监听编辑数据变化
watch(
  editData,
  (newData) => {
    // console.log('=== 编辑数据变化 ===')
    // console.log('新的编辑数据:', newData)
    if (newData) {
      formData.name = newData.name ?? ''
      
      // 设置初始权限数据
      const menuTree = Array.isArray(newData.menuTree) ? newData.menuTree : []
      // console.log('设置初始菜单树:', JSON.stringify(menuTree, null, 2))
      formData.menuTree = JSON.parse(JSON.stringify(menuTree))
      
      // 设置选中状态
      const keys = generateCheckedKeys(menuTree)
      // console.log('设置选中的 keys:', keys)
      checkedKeys.value = keys
      
      // 更新树形数据
      updateTreeData()
    }
  },
  { immediate: true }
)

// 监听选中状态变化，更新树形数据
watch(checkedKeys, () => {
  updateTreeData()
})

// 防抖验证角色名称
const checkRoleNameRepeat = useDebounceFn(async (value: string) => {
  if (!value) return
  // 如果是编辑模式，且名称没有改变，不需要验证
  if (formType.value === 'edit' && value === editData.value.name) {
    return
  }
  await roleApi.checkRoleNameRepeat(value)
}, 1000)

const rules: FormRules = {
  name: [
    { required: true, message: '请输入角色名称' },
    {
      validator: async (rule, value) => {
        try {
          await checkRoleNameRepeat(value)
        } catch (error) {
          throw new Error('角色名称已存在')
        }
      },
      trigger: ['blur', 'input']
    }
  ],
  menuTree: [
    {
      required: true,
      validator: (rule, value) => {
        // 检查是否有选中的菜单或权限
        if (!checkedKeys.value.length) {
          return new Error('请至少选择一个菜单或权限')
        }
      },
      trigger: ['change']
    }
  ]
}

// 表单验证
const validate = async () => {
  try {
    await formRef.value?.validate()
    // 手动触发权限验证
    if (!checkedKeys.value.length) {
      throw new Error('请至少选择一个菜单或权限')
    }
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

// 暴露给父组件的方法和数据
defineExpose({
  get formData() {
    // console.log('=== 获取表单数据 ===')
    const data = {
      ...formData,
      menuTree: JSON.stringify(formData.menuTree)
    }
    // console.log('返回的表单数据:', data)
    return data
  },
  initialData,
  validate,
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
    
    <NFormItem label="权限配置" path="menuTree" :show-require-mark="true">
      <div class="permission-container">
        <div class="tree-header">
          <div class="switch-wrapper">
            <NSwitch
              v-model:value="checkAll"
              :round="false"
              :disabled="isViewMode"
              @update:value="(checked: boolean) => handleCheckAllChange(checked, updateFormData)">
              <template #checked>
                取消勾选全部菜单权限
              </template>
              <template #unchecked>
                勾选全部菜单权限
              </template>
            </NSwitch>
            <NSwitch
              v-model:value="checkAllPermissions"
              :round="false"
              :disabled="isViewMode"
              @update:value="(checked: boolean) => handleCheckAllPermissionsChange(checked, updateFormData)">
              <template #checked>
                取消勾选所有功能权限
              </template>
              <template #unchecked>
                勾选所有功能权限
              </template>
            </NSwitch>
          </div>
        </div>
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
              @update:checked-keys="(keys: string[]) => handleUpdateChecked(keys, updateFormData)"
              @update:expanded-keys="handleUpdateExpanded"
            />
          </div>
        </NScrollbar>
      </div>
    </NFormItem>
  </NForm>
</template>

<style scoped>
.permission-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: v-bind('themeVars.bodyColor');
  border-radius: 8px;
  border: 1px solid v-bind('themeVars.borderColor');
}

.tree-header {
  padding: 8px;
  background-color: v-bind('themeVars.bodyColor');
  border-bottom: 1px solid v-bind('themeVars.borderColor');
  border-radius: 8px 8px 0 0;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 0 auto;
}

.tree-container {
  padding: 4px;
}

.n-scrollbar {
  border-radius: 0 0 8px 8px;
}

:deep(.n-switch__button) {
  height: 18px;
  width: 18px;
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.n-switch__button--pressed) {
  width: 18px;
}

:deep(.n-checkbox-group) {
  display: flex;
  align-items: center;
  margin-left: 12px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

:deep(.n-tree .n-tree-node-content) {
  padding: 2px 2px;
  display: flex;
  align-items: center;
  gap: 12px;
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
  gap: 12px !important;
}

:deep(.n-checkbox) {
  display: flex;
  align-items: center;
  margin-right: 0 !important;
}

:deep(.n-tree-node-content__text) {
  flex: none;
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}

:deep(.n-tree-node) {
  width: 100%;
}

:deep(.n-checkbox.n-checkbox--checked .n-checkbox__label) {
  color: var(--n-color-checked);
}
</style> 