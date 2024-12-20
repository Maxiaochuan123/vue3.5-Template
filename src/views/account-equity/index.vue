<script setup lang="ts">
import { ref,reactive } from 'vue'
import type { DataTableColumns, FormInst } from 'naive-ui'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TablePageLayout from '@/core/table/TableLayout.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  dateRange: [number, number] | null
  type: string | null
  status: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  dateRange: null,
  type: null,
  status: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 类型选项
const advertisementTypeOptions = [
  { label: '充值', value: 'deposit' },
  { label: '提现', value: 'withdraw' },
  { label: '赠送', value: 'bonus' },
]

// 状态选项
const statusOptions = [
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
  { label: '处理中', value: 'processing' },
]

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '变动类型',
    key: 'type',
  },
  {
    title: '变动状态',
    key: 'status',
  },
  {
    title: '本金变动',
    key: 'principalChange',
  },
  {
    title: '总送变动',
    key: 'totalChange',
  },
  {
    title: '操作人',
    key: 'operator',
  },
  {
    title: '操作时间',
    key: 'operateTime',
  },
]

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async ( params: SearchParams ): Promise<{ list: TableDataRecord[]; total: number }> => {
  // 打印完整的搜索参数
  console.log('搜索参数:', params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            type: '充值',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值2',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值3',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值4',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值5',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值6',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值7',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值8',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值9',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值10',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值11',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值12',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值13',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
          {
            id: 1,
            type: '充值14',
            status: '成功',
            principalChange: 1000,
            totalChange: 1100,
            operator: 'admin',
            operateTime: '2024-03-20 10:00:00',
          },
        ],
        total: 100,
      })
    }, 1000)
  })
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ form }">
          <NFormItem label="日期范围" data-width="lg">
            <NDatePicker
              v-model:value="form.dateRange"
              type="daterange"
              clearable
            />
            </NFormItem>
            <NFormItem label="变动类型">
              <NSelect
                v-model:value="form.type"
                :options="advertisementTypeOptions"
                clearable
              />
            </NFormItem>
            <NFormItem label="变动状态">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格区域 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>
  </TablePageLayout>
</template>