<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NSwitch } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions, { type RowActionType } from '@/core/table/table-actions/index.vue'
import DialogForm, { type FormType } from '@/core/form/DialogForm.vue'
import RoleForm from './components/RoleForm.vue'
import { roleApi, type Role, type BaseRoleSearch, type RolePermission } from '@/core/api/modules/role'
import { usePermissionRender } from '@/core/table/composables/usePermissionRender'
import { permissionMenus } from '@/core/permissions-config/treeGenerator'
import { mergePermissionTree, checkPermissionChanges, type PermissionChanges } from './components/RoleFormConfig'
import PermissionChangeDialog from './components/PermissionChangeDialog.vue'

const { withPermission } = usePermissionRender()

type TableDataRecord = Role

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseRoleSearch>({
  name: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const dialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const formRef = ref<InstanceType<typeof RoleForm> | null>(null)
const permissionDialogRef = ref<InstanceType<typeof PermissionChangeDialog> | null>(null)
const formType = ref<FormType>('add')
const editData = ref<Partial<Role>>({})

// 权限变更对话框
const permissionChanges = ref<PermissionChanges>({
  hasChanges: false,
  removedPermissions: [],
  nameChanges: []
})

// 处理权限变更确认
const handlePermissionChangeConfirm = () => {
  if (!permissionChanges.value || !editData.value.menuTree) return
  
  // 合并权限树，保留已有选择
  const mergedMenuTree = mergePermissionTree(permissionMenus, editData.value.menuTree as RolePermission[])
  // console.log('合并后的权限树:', JSON.stringify(mergedMenuTree, null, 2))
  editData.value = {
    ...editData.value,
    menuTree: mergedMenuTree
  }
  dialogRef.value?.open()
}

// 搜索
const handleSearch = (values: BaseRoleSearch) => {
  tableRef.value?.loadData(values)
}

// 刷新列表
const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 处理状态切换
const handleStatusChange = async (row: TableDataRecord, value: boolean) => {
  try {
    await roleApi.updateRoleStatus({ id: row.id, status: value ? 1 : 2 })
    refreshList()
  } catch (error) {
    // 状态切换失败，刷新列表恢复状态
    refreshList()
  }
}

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '角色名称',
    key: 'name',
    width: 150,
  },
  {
    title: '创建人',
    key: 'username',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => withPermission(NSwitch, {
      value: row.status === 1,
      onUpdateValue: (value: boolean) => handleStatusChange(row, value),
    }, 'permission-role', 'status'),
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    align: 'center',
    render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        permissionId: 'permission-role',
        actions: ['edit', 'view', 'delete'],
        deleteConfig: {
          content: '确定要删除该角色吗？删除后不可恢复！',
        },
        onAction: handleTableAction
      })
    },
  },
]


// 处理表格操作
const handleTableAction = async (type: RowActionType, row: TableDataRecord) => {
  if (!row.id) return
  switch (type) {
    case 'edit':
    case 'view':
      handleRoleForm(row, type as FormType)
      break
    case 'delete':
      try {
        await roleApi.deleteRole(row.id)
        refreshList()
      } catch (error) {
        console.error('删除失败:', error)
      }
      break
  }
}

// 新增角色
const handleAdd = () => {
  handleRoleForm({} as TableDataRecord, 'add')
}

// 编辑处理
const handleRoleForm = async (row: TableDataRecord, type: FormType) => {
  formType.value = type
  
  if (type === 'edit' || type === 'view') {
    const currentMenuTree = JSON.parse(row.menuTree as unknown as string) as RolePermission[]
    
    // 如果是编辑模式，检查权限配置是否有变更
    if (type === 'edit') {
      // 获取最新的权限配置
      const latestPermissionMenus = permissionMenus
      // console.log('=== 编辑角色权限 ===')
      // console.log('角色名称:', row.name)
      // console.log('当前菜单树:', JSON.stringify(currentMenuTree, null, 2))
      // console.log('最新权限配置:', JSON.stringify(latestPermissionMenus, null, 2))
      
      const changes = checkPermissionChanges(latestPermissionMenus, currentMenuTree)
      // console.log('检测到变更:', changes)
      
      if (changes.hasChanges) {
        editData.value = {
          ...row,
          menuTree: currentMenuTree
        }
        permissionChanges.value = changes
        permissionDialogRef.value?.open()
        return
      }
    }
    
    // 如果没有变更或是查看模式，直接使用当前权限树
    editData.value = {
      ...row,
      menuTree: currentMenuTree
    }
  } else {
    // 新增时使用空数据
    editData.value = {}
  }
  
  dialogRef.value?.open()
}

</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput v-model:value="searchForm.name" placeholder="请输入角色名称" clearable />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <TableToolbarActions
        :actions="['add']"
        permission-id="permission-role"
        :on-add="handleAdd"
      />
    </template>

    <!-- 表格区域 -->
    <template #table>
      <Table 
        ref="tableRef" 
        :columns="columns" 
        :fetch-api="roleApi.getRoleList" 
      />
    </template>

    <!-- 新增/编辑角色 -->
    <DialogForm
      ref="dialogRef"
      :width="740"
      :form-ref="formRef"
      :formType="formType"
      :add-api="roleApi.createRole"
      :edit-api="roleApi.updateRole"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <RoleForm ref="formRef" />
    </DialogForm>

    <!-- 权限变更提示对话框 -->
    <PermissionChangeDialog
      ref="permissionDialogRef"
      :changes="permissionChanges"
      @confirm="handlePermissionChangeConfirm"
    />
  </TablePageLayout>
</template>
