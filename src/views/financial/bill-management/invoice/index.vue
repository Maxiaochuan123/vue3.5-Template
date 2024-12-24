<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NDatePicker, NSelect, NFormItem } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'

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

// 发票类型选项
const typeOptions = [
  { label: '增值税专用发票', value: 'special' },
  { label: '增值税普通发票', value: 'normal' },
  { label: '电子发票', value: 'electronic' },
]

// 状态选项
const auditStatusOptions = [
  { label: '已开具', value: 'issued' },
  { label: '已作废', value: 'cancelled' },
  { label: '已红冲', value: 'reversed' },
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
            invoiceNo: 'FP2024032001',
            type: '增值税专用发票',
            amount: 1000.00,
            status: '已开具',
            issueDate: '2024-03-20',
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
    title: '发票号码',
    key: 'invoiceNo',
    width: 150,
  },
  {
    title: '发票类型',
    key: 'type',
    width: 150,
  },
  {
    title: '金额',
    key: 'amount',
    width: 120,
  },
  {
    title: '开票日期',
    key: 'issueDate',
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
          content: '确定要删除该发票吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'view':
              console.log('查看发票', rowData)
              break
            case 'edit':
              console.log('编辑发票', rowData)
              break
            case 'delete':
              console.log('删除发票', rowData)
              break
          }
        }
      })
    },
  },
]

// 新增发票
const handleAdd = () => {
  console.log('新增发票')
}

// 导出发票
const handleExport = () => {
  console.log('导出发票')
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
              placeholder="请输入发票号码"
              clearable
            />
          </NFormItem>

          <NFormItem label="开票时间" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="发票类型">
            <NSelect
              v-model:value="searchForm.type"
              :options="typeOptions"
              placeholder="请选择发票类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="状态">
            <NSelect
              v-model:value="searchForm.status"
              :options="auditStatusOptions"
              placeholder="请选择状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <TableToolbarActions :on-add="handleAdd" :on-export="handleExport" />
    </template>

    <!-- 表格区域 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>
  </TablePageLayout>
</template> 