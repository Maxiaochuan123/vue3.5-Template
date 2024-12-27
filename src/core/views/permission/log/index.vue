<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import { logApi, type BaseLogSearch, type Log } from '@/core/api/modules/log'

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseLogSearch>({
  name: null,
  message: null,
  typeId: null,
  dateRange: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 日志类型选项
const logTypeOptions = [
  { label: '登录日志', value: 3 },
  { label: '操作日志', value: 1 },
  { label: '异常日志', value: 2 },
]

// 搜索参数转换
const transformSearchParams = (params: any) => {
  console.log('transformSearchParams:', params)
  const { dateRange, ...rest } = params;
  return {
    ...rest,
    startTime: dateRange?.[0] || null,
    endTime: dateRange?.[1] || null
  }
}

// 搜索
const handleSearch = (values: BaseLogSearch) => {
  tableRef.value?.loadData(values)
}

// 表列定义
const columns: DataTableColumns<Log> = [
  {
    title: '日志类型',
    key: 'typeId',
    width: 120,
    render: (row) => {
      const option = logTypeOptions.find(opt => opt.value === row.typeId)
      return option?.label || '-'
    }
  },
  {
    title: '用户名',
    key: 'name',
    width: 120,
  },
  {
    title: 'IP地址',
    key: 'ipAddress',
    width: 150,
  },
  {
    title: '操作内容',
    key: 'message',
    width: 200,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
    render: (row) => {
      return new Date(row.createTime).toLocaleString()
    }
  },
]
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :transform-params="transformSearchParams" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="用户名" data-width="md">
            <NInput
              v-model:value="searchForm.name"
              placeholder="请输入用户名"
              clearable
            />
          </NFormItem>

          <NFormItem label="操作内容" data-width="md">
            <NInput
              v-model:value="searchForm.message"
              placeholder="请输入操作内容"
              clearable
            />
          </NFormItem>

          <NFormItem label="日志类型">
            <NSelect
              v-model:value="searchForm.typeId"
              :options="logTypeOptions"
              placeholder="请选择日志类型"
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
        </template>
      </SearchForm>
    </template>

    <!-- 表格区域 -->
    <template #table>
      <Table 
        ref="tableRef" 
        :columns="columns" 
        :fetch-api="logApi.getLogList" 
      />
    </template>
  </TablePageLayout>
</template> 