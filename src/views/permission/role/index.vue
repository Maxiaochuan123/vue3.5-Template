<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NSelect, NFormItem, NTag } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/TableToolbarActions.vue'
import TableActions from '@/core/table/TableActions.vue'
import DialogForm from '@/core/form/DialogForm.vue'
import RoleForm, { type FormState } from './components/RoleForm.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
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
const tableFetchApi = async (params: SearchParams): Promise<{ list: TableDataRecord[]; total: number }> => {
  console.log('搜索参数:', params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            name: '超级管理员',
            code: 'super_admin',
            description: '系统最高权限角色',
            permissions: ['所有权限'],
            createTime: '2024-03-20 10:00:00',
          },
          {
            id: 2,
            name: '运营',
            code: 'operator',
            description: '运营人员角色',
            permissions: ['广告管理', '内容管理'],
            createTime: '2024-03-20 10:00:00',
          },
        ],
        total: 2,
      })
    }, 1000)
  })
}

// 刷新列表
const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 编辑处理
const handleRoleForm = (row: Record<string, any>, type: 'edit' | 'view') => {
  formType.value = type
  editData.value = { ...row }
  dialogRef.value?.open()
}

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '角色名称',
    key: 'name',
    width: 150,
  },
  {
    title: '角色编码',
    key: 'code',
    width: 150,
  },
  {
    title: '描述',
    key: 'description',
    width: 200,
  },
  {
    title: '权限',
    key: 'permissions',
    width: 300,
    render: (row) => {
      return row.permissions.map((perm: string) => {
        return h(NTag, {
          style: {
            marginRight: '6px'
          },
          type: 'info',
          bordered: false
        }, { default: () => perm })
      })
    }
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
        actions: ['edit', 'delete'],
        deleteConfig: {
          content: '确定要删除该角色吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'edit':
              handleRoleForm(rowData, 'edit')
              break
            case 'delete':
              console.log('删除', rowData)
              break
          }
        }
      })
    },
  },
]

// 新增角色
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {}
  dialogRef.value?.open()
}

// 表单提交
const submitApi = async (formData: FormState) => {
  console.log('提交的数据:', formData)
  return Promise.resolve()
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.keyword"
              placeholder="请输入角色名称/编码"
              clearable
            />
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
      :form-ref="formRef?.formRef"
      :formType="formType"
      :submit-api="submitApi"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <RoleForm ref="formRef" />
    </DialogForm>
  </TablePageLayout>
</template> 