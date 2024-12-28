<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import { changeStatusOptions, changeTypeOptions, getOptionLabel } from '@/enum/options'
import { accountEquityApi, type BaseAccountEquitySearch, type AccountEquity } from '@/api/modules/account-equity'

type TableDataRecord = AccountEquity

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseAccountEquitySearch>({
  key: null,
  dateRange: null,
  status: null,
  type: null,
})

// 搜索参数转换
const transformSearchParams = (params: any) => {
  console.log('transformSearchParams:', params)
  const { dateRange, ...rest } = params;
  return {
    ...rest,
    startDate: dateRange?.[0] ? new Date(dateRange[0]).toISOString().split('T')[0] : null,
    endDate: dateRange?.[1] ? new Date(dateRange[1]).toISOString().split('T')[0] : null
  }
}

const tableRef = ref<InstanceType<typeof Table> | null>(null)
        
// 搜索
const handleSearch = (values: BaseAccountEquitySearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '变动类型',
    key: 'type',
    render: (row) => {
      return getOptionLabel(changeTypeOptions, row.type)
    },
  },
  {
    title: '变动状态',
    key: 'status',
    render: (row) => {
      return getOptionLabel(changeStatusOptions, row.status)
    },
  },
  {
    title: '本金变动',
    key: 'principalAmount',
    render: (row) => {
      return row.principalAmount ? '￥' + row.principalAmount : '--'
    },
  },
  {
    title: '赠送变动',
    key: 'giftAmount',
    render: (row) => {
      return row.giftAmount ? '￥' + row.giftAmount : '--'
    },
  },
  {
    title: '操作人',
    key: 'username',
  },
  {
    title: '时间',
    key: 'time',
  }
]
const mydate = ref()
</script>

<template>
  <TablePageLayout>
    <template #search>
          
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch" :transform-params="transformSearchParams">
        <template #default="{ searchForm }">
          <NFormItem label="时间" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="变动类型" data-width="sm">
            <NSelect
              v-model:value="searchForm.type"
              :options="changeTypeOptions"
              placeholder="请选择变动类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="变动状态" data-width="sm">
            <NSelect
              v-model:value="searchForm.status"
              :options="changeStatusOptions"
              placeholder="请选择变动状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="accountEquityApi.getAccountEquityList" />
    </template>
  </TablePageLayout>
</template>
