<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NDatePicker, NSelect, NFormItem } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/TableToolbarActions.vue'
import TableActions from '@/core/table/TableActions.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
  dateRange: [number, number] | null
  type: string | null
  status: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
  dateRange: null,
  type: null,
  status: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 票据类型选项
const billTypeOptions = [
  { label: '发票', value: 'invoice' },
  { label: '收据', value: 'receipt' },
]

// 状态选项
const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已处理', value: 'processed' },
  { label: '已作废', value: 'voided' },
]

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async (params: SearchParams): Promise<{ list: TableDataRecord[]; total: number }> => {
  // 打印完整的搜索参数
  console.log('搜索参数:', params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            billNo: 'BL2024032001',
            type: '发票',
            amount: 1000.00,
            status: '待处理',
            creator: 'admin',
            createTime: '2024-03-20 10:00:00',
          },
          // Add more mock data as needed
        ],
        total: 1,
      })
    }, 1000)
  })
}

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '票据编号',
    key: 'billNo',
    width: 150,
  },
  {
    title: '票据类型',
    key: 'type',
    width: 120,
  },
  {
    title: '金额',
    key: 'amount',
    width: 120,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
  },
  {
    title: '创建人',
    key: 'creator',
    width: 120,
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
        actions: ['view', 'edit', 'delete'],
        deleteConfig: {
          content: '确定要删除该票据吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'view':
            case 'edit':
              console.log(type, rowData)
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

// 新增票据
const handleAdd = () => {
  console.log('新增票据')
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
              placeholder="请输入票据编号"
              clearable
            />
          </NFormItem>

          <NFormItem label="创建时间" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="票据类型">
            <NSelect
              v-model:value="searchForm.type"
              :options="billTypeOptions"
              placeholder="请选择票据类型"
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