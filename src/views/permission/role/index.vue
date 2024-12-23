<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NFormItem, NTag } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'
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
            permissions: [
              {
                  "id": "1",
                  "name": "首页",
                  "isChecked": false,
                  "permissions": [],
                  "children": []
              },
              {
                  "id": "2",
                  "name": "账户权益",
                  "isChecked": false,
                  "permissions": [],
                  "children": []
              },
              {
                  "id": "3",
                  "name": "广告管理",
                  "isChecked": true,
                  "permissions": [
                      "edit",
                      "view"
                  ],
                  "children": []
              },
              {
                  "id": "4",
                  "name": "财务管理",
                  "isChecked": true,
                  "permissions": [],
                  "children": [
                      {
                          "id": "4-1",
                          "name": "票据管理",
                          "isChecked": true,
                          "permissions": [
                              "delete"
                          ],
                          "children": [{
                            "id": "4-1-1",
                            "name": "发票",
                            "isChecked": true,
                            "permissions": [
                              "delete",
                              "view"
                            ],
                            "children": []
                          }]
                      }
                  ]
              },
              {
                  "id": "5",
                  "name": "权限管理",
                  "isChecked": true,
                  "permissions": [],
                  "children": [
                      {
                          "id": "5-1",
                          "name": "账号管理",
                          "isChecked": false,
                          "permissions": [
                          ],
                          "children": []
                      },
                      {
                          "id": "5-2",
                          "name": "角色管理",
                          "isChecked": true,
                          "permissions": [],
                          "children": []
                      },
                      {
                          "id": "5-3",
                          "name": "系统日志",
                          "isChecked": true,
                          "permissions": [],
                          "children": []
                      }
                  ]
              }
            ],
            createTime: '2024-03-20 10:00:00',
          }
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
  console.log(row.permissions);
  
  formType.value = type
  editData.value = {
    name: row.name,
    permissions: row.permissions || []
  }
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
        deleteConfig: {
          content: '确定要删除该角色吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'edit':
            case 'view':
              handleRoleForm(rowData, type)
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
  editData.value = {
    name: '',
    permissions: []
  }
  dialogRef.value?.open()
}

// 表单提交
const submitApi = async (formData: FormState) => {
  console.log('提交的数据:', formData.permissions)
  return Promise.resolve(formData)
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
      :width="700"
      :form-ref="formRef"
      :formType="formType"
      :submit-api="submitApi"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
      title="角色"
    >
      <RoleForm ref="formRef" />
    </DialogForm>
  </TablePageLayout>
</template> 