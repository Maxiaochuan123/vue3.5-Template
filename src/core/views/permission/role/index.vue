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
import { roleApi, type Role, type BaseRoleSearch } from '@/core/api/modules/role'


type TableDataRecord = Role

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseRoleSearch>({
  name: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const dialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const formRef = ref<InstanceType<typeof RoleForm> | null>(null)
const formType = ref<FormType>('add')
const editData = ref<Partial<Role>>({})

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
    render: (row) => {
      return h(NSwitch, {
        value: row.status === 1,
        onUpdateValue: (value) => handleStatusChange(row, value),
      })
    },
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
      handleRoleForm(row, type)
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
  formType.value = 'add'
  editData.value = {}
  dialogRef.value?.open()
}

// 编辑处理
const handleRoleForm = (row: Record<string, any>, type: 'edit' | 'view') => {
  formType.value = type
  editData.value = {
    id: row.id,
    name: row.name,
    menuTree: JSON.parse(row.menuTree as unknown as string),
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
  </TablePageLayout>
</template>
