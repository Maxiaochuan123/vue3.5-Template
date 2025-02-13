<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/components/table/TableLayout.vue'
import SearchForm from '@/core/components/table/SearchForm.vue'
import Table from '@/core/components/table/Table.vue'
import { balanceChangeApi, type BaseBalanceChangeSearch, type BalanceChange } from '@/api/modules/balanceChange'
import { changeTypeOptions, changeStatusOptions } from '@/enum/options'

type TableDataRecord = BalanceChange

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseBalanceChangeSearch>({
  key: null,
  mobile: null,
  type: null,
  dateRange: null,
})

// 搜索参数转换
const transformSearchParams = (params: any) => {
  const { dateRange, ...rest } = params;
  return {
    ...rest,
    startDate: dateRange?.[0] ? new Date(dateRange[0]).toISOString().split('T')[0] : null,
    endDate: dateRange?.[1] ? new Date(dateRange[1]).toISOString().split('T')[0] : null
  }
}

const tableRef = ref<InstanceType<typeof Table> | null>(null)
        
// 搜索
const handleSearch = (values: BaseBalanceChangeSearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '真实姓名',
    key: 'realName'
  },
  {
    title: '手机号',
    key: 'mobile'
  },
  {
    title: '变动类型',
    key: 'type',
    render: (row: TableDataRecord) => {
      return changeTypeOptions.find(item => item.value === row.type)?.label || '--'
    }
  },
  {
    title: '变动状态',
    key: 'status',
    render: (row: TableDataRecord) => {
      return changeStatusOptions.find(item => item.value === row.status)?.label || '--'
    }
  },
  {
    title: '本金变动',
    key: 'principalAmount'
  },
  {
    title: '赠送变动',
    key: 'giftAmount'
  },
  {
    title: '操作人',
    key: 'username'
  },
  {
    title: '变动时间',
    key: 'time',
    width: 180
  }
]

</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch" :transform-params="transformSearchParams">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.key"
              placeholder="请输入联系人关键词"
              clearable
            />
          </NFormItem>

          <NFormItem label="手机号" data-width="md">
            <NInput
              v-model:value="searchForm.mobile"
              placeholder="请输入手机号"
              clearable
            />
          </NFormItem>

          <NFormItem label="类型" data-width="md">
            <NSelect v-model:value="searchForm.type" :options="changeTypeOptions" />
          </NFormItem>

          <!-- 变动日期范围 -->
          <NFormItem label="变动日期范围" data-width="md">
            <NDatePicker v-model:value="searchForm.dateRange" type="datetimerange" />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="balanceChangeApi.getBalanceChangeList" />
    </template>
  </TablePageLayout>
</template>
