import { provide, inject } from 'vue'

/**
 * 表格高度更新回调函数类型
 */
type TableHeightUpdateCallback = () => void

/**
 * 用于依赖注入的 key
 */
export const TABLE_HEIGHT_KEY = 'tableHeight'

/**
 * 提供更新表格高度的方法
 * 用于需要触发表格高度重新计算的组件（如 SearchForm）
 */
export const useTableHeightProvider = () => {
  const callback = inject<TableHeightUpdateCallback>(TABLE_HEIGHT_KEY)

  const updateTableHeight = () => {
    callback?.()
  }

  return {
    updateTableHeight
  }
}

/**
 * 注册表格高度更新的回调函数
 * 在表格组件中使用，当收到更新信号时重新计算高度
 */
export const useTableHeight = (callback: TableHeightUpdateCallback) => {
  provide(TABLE_HEIGHT_KEY, callback)
} 