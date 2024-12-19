import { provide, inject, type InjectionKey } from 'vue'

/**
 * 表格高度更新回调函数类型
 * 当需要重新计算表格高度时会调用此函数
 */
type TableHeightUpdateCallback = () => void

/**
 * 用于依赖注入的 Symbol key
 * 确保提供者和注入者之间的类型安全
 */
const tableHeightKey = Symbol() as InjectionKey<TableHeightUpdateCallback>

/**
 * 提供更新表格高度的方法
 * 通常在触发表格高度需要重新计算的组件中使用（如 SearchForm）
 */
export const useTableHeightProvider = () => {
  const updateTableHeight = () => {
    // 获取注入的回调函数并执行
    const callback = inject(tableHeightKey)
    callback?.()
  }

  return {
    updateTableHeight
  }
}

/**
 * 注册表格高度更新的回调函数
 * 在表格组件中使用，当收到更新信号时重新计算高度
 * @param callback 更新表格高度的回调函数
 */
export const useTableHeight = (callback: TableHeightUpdateCallback) => {
  provide(tableHeightKey, callback)
} 