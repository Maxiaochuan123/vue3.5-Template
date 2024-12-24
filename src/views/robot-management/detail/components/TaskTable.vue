<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="任务类型" data-width="sm">
            <NSelect
              v-model:value="searchForm.type"
              :options="taskTypeOptions"
              placeholder="请选择任务类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="执行状态" data-width="sm">
            <NSelect
              v-model:value="searchForm.status"
              :options="taskStatusOptions"
              placeholder="请选择执行状态"
              clearable
            />
          </NFormItem>

          <NFormItem label="执行时间" data-width="lg">
            <NDatePicker v-model:value="searchForm.dateRange" type="datetimerange" clearable />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>
  </TablePageLayout>
</template>

<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NButton, NTag, type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'

interface TableDataRecord {
  id: number
  type: 'sync' | 'message' | 'friend' | 'group'
  target: string
  status: 'pending' | 'running' | 'success' | 'failed'
  startTime: string
  endTime: string
  result: string
}

interface SearchParams {
  type: string | null
  status: string | null
  dateRange: [number, number] | null
}

// 任务类型选项
const taskTypeOptions = [
  { label: '同步任务', value: 'sync' },
  { label: '消息任务', value: 'message' },
  { label: '好友任务', value: 'friend' },
  { label: '群任务', value: 'group' },
]

// 任务状态选项
const taskStatusOptions = [
  { label: '待执行', value: 'pending' },
  { label: '执行中', value: 'running' },
  { label: '执行成功', value: 'success' },
  { label: '执行失败', value: 'failed' },
]

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  type: null,
  status: null,
  dateRange: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async (
  params: SearchParams,
): Promise<{ list: TableDataRecord[]; total: number }> => {
  console.log('搜索参数:', params)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            type: 'sync',
            target: '好友列表同步',
            status: 'success',
            startTime: '2024-03-15 10:30:00',
            endTime: '2024-03-15 10:31:00',
            result: '同步成功，更新 50 条记录',
          },
          {
            id: 2,
            type: 'message',
            target: '群发消息',
            status: 'running',
            startTime: '2024-03-15 10:35:00',
            endTime: '',
            result: '正在执行...',
          },
        ],
        total: 100,
      })
    }, 500)
  })
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '任务类型',
    key: 'type',
    width: 120,
    render: (row) => {
      const typeMap = {
        sync: { type: 'info', text: '同步任务' },
        message: { type: 'success', text: '消息任务' },
        friend: { type: 'warning', text: '好友任务' },
        group: { type: 'error', text: '群任务' },
      }
      const type = typeMap[row.type]
      return h(
        NTag,
        { type: type.type as 'info' | 'success' | 'warning' | 'error' },
        { default: () => type.text },
      )
    },
  },
  {
    title: '任务目标',
    key: 'target',
    width: 200,
  },
  {
    title: '执行状态',
    key: 'status',
    width: 120,
    render: (row) => {
      const statusMap = {
        pending: { type: 'default', text: '待执行' },
        running: { type: 'info', text: '执行中' },
        success: { type: 'success', text: '执行成功' },
        failed: { type: 'error', text: '执行失败' },
      }
      const status = statusMap[row.status]
      return h(
        NTag,
        { type: status.type as 'default' | 'info' | 'success' | 'error' },
        { default: () => status.text },
      )
    },
  },
  {
    title: '开始时间',
    key: 'startTime',
    width: 180,
  },
  {
    title: '结束时间',
    key: 'endTime',
    width: 180,
  },
  {
    title: '执行结果',
    key: 'result',
    width: 200,
  },
]
</script>
