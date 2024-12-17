<script setup lang="ts">
import { ref } from 'vue'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useTableData } from '@/hooks/useTableData'
import type { RequestParams } from '@/hooks/useTableData'

interface TableProps<T, P = RequestParams> {
  columns: DataTableColumns<T>
  fetchData: (params: P) => Promise<{ list: T[]; total: number }>
}

const props = defineProps<TableProps<any, any>>()

// 使用 useTableData
const { loading, data, pagination, loadData, handlePageChange, handlePageSizeChange } = useTableData({
  fetchData: props.fetchData
})

// 表格分页配置
const tablePagination = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  showSizePicker: pagination.showSizePicker,
  pageSizes: pagination.pageSizes,
  itemCount: pagination.itemCount,
  onChange: handlePageChange,
  onUpdatePageSize: handlePageSizeChange,
}

// 暴露方法给父组件
defineExpose({
  loadData,
  refresh: () => loadData()
})
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="tablePagination"
  />
</template> 