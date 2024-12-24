<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NSelect, NFormItem, NSwitch } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import { statusOptions } from '@/enum/options'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
  status: string | null
  role: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
  status: null,
  role: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '运营', value: 'operator' },
  { label: '财务', value: 'finance' },
]

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
            username: 'admin',
            nickname: '管理员',
            role: '管理员',
            email: 'admin@example.com',
            status: '启用',
            lastLoginTime: '2024-03-20 10:00:00',
            createTime: '2024-03-20 10:00:00',
          },
        ],
        total: 1,
      })
    }, 1000)
  })
}

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '用户名',
    key: 'username',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '角色',
    key: 'role',
    width: 120,
  },
  {
    title: '邮箱',
    key: 'email',
    width: 180,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      return h(NSwitch, {
        value: row.status === '启用',
        onUpdateValue: (value) => {
          console.log('切换状态:', value, row)
        }
      })
    }
  },
  {
    title: '最后登录时间',
    key: 'lastLoginTime',
    width: 180,
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
          content: '确定要删除该账号吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'edit':
              console.log('编辑', rowData)
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

// 新增账号
const handleAdd = () => {
  console.log('新增账号')
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
              placeholder="请输入用户名/昵称/邮箱"
              clearable
            />
          </NFormItem>

          <NFormItem label="状态">
            <NSelect
              v-model:value="searchForm.status"
              :options="statusOptions"
              placeholder="请选择状态"
              clearable
            />
          </NFormItem>

          <NFormItem label="角色">
            <NSelect
              v-model:value="searchForm.role"
              :options="roleOptions"
              placeholder="请选择角色"
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
  </TablePageLayout>
</template> 