<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NInput, NSelect, NFormItem, NDatePicker, NTag } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
  dateRange: [number, number] | null
  type: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
  dateRange: null,
  type: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 日志类型选项
const logTypeOptions = [
  { label: '登录日志', value: 'login' },
  { label: '操作日志', value: 'operation' },
  { label: '系统日志', value: 'system' },
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
            type: '登录日志',
            username: 'admin',
            ip: '192.168.1.1',
            action: '用户登录',
            status: '成功',
            detail: '登录成功',
            createTime: '2024-03-20 10:00:00',
          },
          {
            id: 2,
            type: '操作日志',
            username: 'operator',
            ip: '192.168.1.2',
            action: '新增广告',
            status: '成功',
            detail: '新增广告：XXX',
            createTime: '2024-03-20 11:00:00',
          },
        ],
        total: 2,
      })
    }, 1000)
  })
}

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '日志类型',
    key: 'type',
    width: 120,
  },
  {
    title: '用户名',
    key: 'username',
    width: 120,
  },
  {
    title: 'IP地址',
    key: 'ip',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      const type = row.status === '成功' ? 'success' : 'error'
      return h(NTag, {
        type,
        bordered: false
      }, { default: () => row.status })
    }
  },
  {
    title: '详情',
    key: 'detail',
    width: 300,
  },
  {
    title: '时间',
    key: 'createTime',
    width: 180,
  },
]
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.keyword"
              placeholder="请输入用户名/IP/操作内容"
              clearable
            />
          </NFormItem>

          <NFormItem label="时间范围" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="日志类型">
            <NSelect
              v-model:value="searchForm.type"
              :options="logTypeOptions"
              placeholder="请选择日志类型"
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