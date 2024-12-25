<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NFormItem, NTag, NSwitch } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import DialogForm from '@/core/form/DialogForm.vue'
import RoleForm, { type FormState } from './components/RoleForm.vue'
import { roleApi } from '@/api/modules/role'
import type { Role } from '@/api/modules/role'

type TableDataRecord = Role

interface SearchParams {
  name: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  name: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const dialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const formRef = ref<InstanceType<typeof RoleForm> | null>(null)
const formType = ref<'add' | 'edit' | 'view'>('add')
const editData = ref<Partial<FormState>>({})

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async (
  params: SearchParams,
): Promise<{ list: TableDataRecord[]; total: number }> => {
  const res = await roleApi.getRoleList({
    name: params.name || undefined,
    pageIndex: 1,
    pageSize: 10,
  })
  return {
    list: res.data.records,
    total: res.data.total,
  }
}

// 刷新列表
const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 编辑处理
const handleRoleForm = (row: TableDataRecord, type: 'edit' | 'view') => {
  formType.value = type
  editData.value = {
    id: row.id,
    name: row.name,
    permissions: row.menuTree,
  }
  dialogRef.value?.open()
}

// 处理状态切换
const handleStatusChange = async (row: TableDataRecord, value: boolean) => {
  try {
    await roleApi.updateRoleStatus(row.id, value ? 1 : 2)
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
        row: row as any,
        deleteConfig: {
          content: '确定要删除该角色吗？删除后不可恢复！',
        },
        onAction: (type, row) => {
          switch (type) {
            case 'edit':
            case 'view':
              handleRoleForm(row, type)
              break
            case 'delete':
              console.log('删除', row)
              break
          }
        },
      })
    },
  },
]

// 新增角色
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {
    name: '',
    permissions: [],
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
      <TableToolbarActions :on-add="handleAdd" />
    </template>

    <!-- 表格区域 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
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
      title="角色"
    >
      <RoleForm ref="formRef" />
    </DialogForm>
  </TablePageLayout>
</template>
