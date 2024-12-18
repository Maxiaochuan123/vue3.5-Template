import { reactive } from 'vue'

/**
 * 表单数据管理 Hook 配置接口
 */
interface UseFormDataOptions<T> {
  /** 初始表单数据 */
  initialData: T
  /** 可选的数据转换函数 */
  transformData?: (data: Record<string, any>) => Partial<T>
}

/**
 * 表单数据管理 Hook
 * @param options Hook 配置选项
 * @returns 表单数据和相关方法
 */
export function useFormData<T extends Record<string, any>>(options: UseFormDataOptions<T>) {
  const { initialData, transformData } = options
  
  // 创建响应式表单数据
  const formData = reactive<T>({ ...initialData })
  
  /**
   * 重置表单数据到初始状态
   */
  const resetForm = () => {
    Object.assign(formData, initialData)
  }
  
  /**
   * 用编辑数据填充表单
   * @param editData 要填充的编辑数据
   */
  const fillForm = (editData?: Record<string, any>) => {
    if (!editData) {
      resetForm()
      return
    }
    
    // 如果提供了数据转换函数，使用它处理数据
    const transformedData = transformData 
      ? transformData(editData)
      : editData
      
    Object.assign(formData, transformedData)
  }
  
  return {
    formData,
    resetForm,
    fillForm
  }
} 