<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import { useMessage, type DataTableInst } from 'naive-ui'
import { useTableData } from './hooks/useTableData'
import { useTableHeight, TABLE_HEIGHT_KEY } from './hooks/useTableHeight'

interface TableProps<T = any, P = any> {
  /** 获取表格数据的 API 函数 */
  fetchApi: (params: P) => Promise<{ list: T[]; total: number }>
}

const props = defineProps<TableProps>()
const message = useMessage()

/** 表格 DOM 引用 */
const tableRef = ref<DataTableInst | null>(null)
/** 表格最大高度 */
const maxTableHeight = ref()

/**
 * 计算表格的最大高度
 * 根据表格顶部到视窗顶部的距离和视窗高度来计算
 */
const calculateMaxHeight = () => {
  const tableElement = tableRef.value?.$el as HTMLElement
  if (tableElement) {
    const tableTop = tableElement.getBoundingClientRect().top
    const viewportHeight = window.innerHeight
    const bottomPadding = 120 // 预留底部空间（分页器等）
    maxTableHeight.value = viewportHeight - tableTop - bottomPadding
  }
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
  reset
} = useTableData({
  fetchApi: props.fetchApi,
  message
})

// 暴露方法给父组件
defineExpose({
  loadData,
  refresh,
  reset,
  recalculateHeight: calculateMaxHeight
})

// 注册表格高度更新回调
// 当其他组件（如 SearchForm）触发高度更新时执行
useTableHeight(async () => {
  await nextTick()
  // 等待下一帧动画执行时再计算高度，确保获取到正确的 DOM 尺寸
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
    :pagination="pagination"
    :max-height="maxTableHeight"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  />
</template>