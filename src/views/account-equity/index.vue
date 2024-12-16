<script setup lang="ts">
import { ref } from 'vue'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { useSearch } from '@/hooks/useSearch'
import { useTableData } from '@/hooks/useTableData'
import TablePageLayout from '@/components/pageLayout/TablePageLayout.vue'
import type { RequestParams } from '@/hooks/useTableData'

interface EquityRecord {
  id: number
  type: string
  status: string
  principalChange: number
  totalChange: number
  operator: string
  operateTime: string
}

interface SearchParams extends RequestParams {
  dateRange: [number, number] | null
  type: string | null
  status: string | null
}

// 先初始化 useTableData
const { loading, data, pagination, loadData, handlePageChange, handlePageSizeChange } =
  useTableData<EquityRecord, SearchParams>({
    async fetchData(_params: SearchParams) {
      // API 调用
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
            ],
            total: 100,
          })
        }, 1000)
      })
    },
    // 可选：转换请求参数
    transformParams: (params) => {
      const { dateRange, ...rest } = params
      return {
        ...rest,
        startTime: dateRange?.[0],
        endTime: dateRange?.[1],
      }
    },
    // 默认为 true，页面加载时就获取数据
  })

// 添加表单 ref
const searchFormRef = ref<FormInst | null>(null)

// 使用 useSearch 时传入 searchFormRef
const { searchForm, handleReset, handleSearch } = useSearch<SearchParams>({
  defaultValues: {
    dateRange: null,
    type: null,
    status: null,
  },
  onSearch: (values) => {
    loadData(values)
  },
  searchFormRef, // 传入表单 ref
})

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
const columns: DataTableColumns<EquityRecord> = [
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

// 在使用 pagination 之前确保所有必需的属性都有正确的类型
const tablePagination = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  showSizePicker: pagination.showSizePicker,
  pageSizes: pagination.pageSizes,
  itemCount: pagination.itemCount,
  onChange: handlePageChange,
  onUpdatePageSize: handlePageSizeChange,
}
</script>

<template>
  <TablePageLayout>
    <!-- 搜索表单 -->
    <NForm
      ref="searchFormRef"
      :model="searchForm"
      inline
      :show-feedback="false"
      :label-width="80"
      medium
    >
      <NFormItem label="日期范围">
        <NDatePicker
          v-model:value="searchForm.dateRange"
          type="daterange"
          clearable
          :style="{ width: '320px' }"
        />
      </NFormItem>
      <NFormItem label="变动类型">
        <NSelect
          v-model:value="searchForm.type"
          :options="advertisementTypeOptions"
          clearable
          :style="{ width: '160px' }"
        />
      </NFormItem>
      <NFormItem label="变动状态">
        <NSelect
          v-model:value="searchForm.status"
          :options="statusOptions"
          clearable
          :style="{ width: '140px' }"
        />
      </NFormItem>
      <NFormItem>
        <NSpace>
          <NButton type="primary" @click="handleSearch">查询</NButton>
          <NButton @click="handleReset">重置</NButton>
        </NSpace>
      </NFormItem>
    </NForm>

    <!-- 表格区域 -->
    <div class="table-container">
      <NDataTable
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="tablePagination"
      />
    </div>
  </TablePageLayout>
</template>

<style scoped lang="less">
.search-form {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.table-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.n-data-table) {
  flex: 1;
}
</style>
