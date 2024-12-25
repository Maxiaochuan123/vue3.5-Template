<script setup lang="ts" name="DataTableWrapper">
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import { useMessage, type DataTableInst, NDataTable } from 'naive-ui'
import { useTableData } from './hooks/useTableData'
import { useTableHeight, TABLE_HEIGHT_KEY } from './hooks/useTableHeight'

interface TableProps<T = Record<string, any>, P = Record<string, any>> {
  /** 获取表格数据的 API 函数 */
  fetchApi: (params: P) => Promise<{ list: T[]; total: number }>
  /** 是否显示多选 */
  rowSelection?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  rowSelection: false,
})

const emit = defineEmits<{
  (e: 'update:checked-row-keys', keys: (string | number)[]): void
  (e: 'update:checked-rows', rows: Record<string, any>[]): void
}>()

const message = useMessage()

/** 表格 DOM 引用 */
const tableRef = ref<DataTableInst | null>(null)
/** 表格最大高度 */
const maxTableHeight = ref<number>()
/** 选中的行 key */
const checkedRowKeys = ref<(string | number)[]>([])

// 选择变化处理
const handleSelectionChange = (keys: (string | number)[], rows: Record<string, any>[]) => {
  checkedRowKeys.value = keys
  emit('update:checked-row-keys', keys)
  emit('update:checked-rows', rows)
}

/**
 * 计算表格的最大高度
 * 根据表格顶部到视窗顶部的距离和视窗高度来计算
 */
const calculateMaxHeight = () => {
  if (!tableRef.value) return
  const tableElement = tableRef.value.$el as HTMLElement
  const tableTop = tableElement.getBoundingClientRect().top
  const viewportHeight = window.innerHeight
  const bottomPadding = 120 // 预留底部空间（分页器等）
  maxTableHeight.value = viewportHeight - tableTop - bottomPadding
}

// 直接提供回调函数
provide(TABLE_HEIGHT_KEY, calculateMaxHeight)

// 组件挂载时初始化
onMounted(async () => {
  await nextTick()
  calculateMaxHeight()
  // 监听窗口大小变化
  window.addEventListener('resize', calculateMaxHeight)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', calculateMaxHeight)
})

// 使用 useTableData 处理表格数据逻辑
const {
  loading,
  data,
  pagination,
  loadData,
  handlePageChange,
  handlePageSizeChange,
  refresh,
  reset,
} = useTableData({
  fetchApi: props.fetchApi,
  message,
})

// 暴露方法给父组件
defineExpose({
  loadData,
  refresh,
  reset,
  recalculateHeight: calculateMaxHeight,
  getCheckedRows: () => checkedRowKeys.value,
})

// 注册表格高度更新回调
useTableHeight(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    calculateMaxHeight()
  })
})
</script>

<template>
  <NDataTable
    ref="tableRef"
    v-bind="$attrs"
    :loading="loading"
    :data="data"
    :scroll-x="1000"
    :pagination="pagination"
    :max-height="maxTableHeight"
    :row-key="(row: Record<string, any>) => row.id"
    :checked-row-keys="checkedRowKeys"
    @update:checked-row-keys="handleSelectionChange"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  />
</template>
