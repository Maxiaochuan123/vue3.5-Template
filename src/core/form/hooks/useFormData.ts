import { reactive, watch, inject, type Ref } from 'vue'

/**
 * 表单类型：新增、编辑、查看
 */
type FormType = 'add' | 'edit' | 'view'

/**
 * 表单数据管理 Hook 配置接口
 * @example
 * ```ts
 * interface UserForm {
 *   name: string
 *   age: number
 *   email: string
 * }
 * 
 * const { formData, resetForm } = useFormData<UserForm>({
 *   initialData: {
 *     name: '',
 *     age: 0,
 *     email: ''
 *   },
 *   // 可选：转换数据的函数
 *   transformData: (data) => ({
 *     ...data,
 *     age: Number(data.age)
 *   }),
 *   // 可选：编辑时的数据
 *   editData: ref({
 *     name: 'John',
 *     age: 25
 *   })
 * })
 * ```
 */
interface UseFormDataOptions<T extends Record<string, any>> {
  /** 
   * 初始表单数据，定义表单的数据结构和默认值
   * @example
   * ```ts
   * initialData: {
   *   username: '',
   *   password: '',
   *   remember: false
   * }
   * ```
   */
  initialData: T

  /** 
   * 可选的数据转换函数，用于在填充数据前转换数据格式
   * @example
   * ```ts
   * transformData: (data) => ({
   *   ...data,
   *   birthday: new Date(data.birthday),
   *   age: Number(data.age)
   * })
   * ```
   */
  transformData?: (data: Record<string, any>) => Partial<T>

  /** 
   * 编辑数据，用于编辑模式下的数据填充
   * 通常从父组件通过 props 传入
   */
  editData?: Ref<Partial<T> | undefined>
}

/**
 * useFormData Hook 返回值接口
 */
interface UseFormDataReturn<T extends Record<string, any>> {
  /** 响应式表单数据 */
  formData: T
  /** 重置表单到初始状态 */
  resetForm: () => void
  /** 使用指定数据填充表单 */
  fillForm: (data?: Partial<T>) => void
  /** 初始表单数据（非响应式） */
  initialData: T
}

/**
 * 表单数据管理 Hook
 * 
 * 用于管理表单数据的生命周期，包括：
 * 1. 初始化表单数据
 * 2. 编辑模式下的数据填充
 * 3. 表单重置
 * 4. 数据转换
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * interface LoginForm {
 *   username: string
 *   password: string
 *   remember: boolean
 * }
 * 
 * const { formData, resetForm } = useFormData<LoginForm>({
 *   initialData: {
 *     username: '',
 *     password: '',
 *     remember: false
 *   }
 * })
 * </script>
 * 
 * <template>
 *   <NForm :model="formData">
 *     <NFormItem label="用户名">
 *       <NInput v-model:value="formData.username" />
 *     </NFormItem>
 *     <NButton @click="resetForm">重置</NButton>
 *   </NForm>
 * </template>
 * ```
 */
export function useFormData<T extends Record<string, any>>(
  options: UseFormDataOptions<T>
): UseFormDataReturn<T> {
  const { initialData, transformData } = options
  
  // 创建响应式表单数据
  const formData = reactive<T>({ ...initialData }) as T
  
  // 注入响应式的 formType 和 editData
  const formType = inject<Ref<FormType>>('formType')
  const injectedEditData = inject<Ref<Partial<T> | undefined>>('editData')
  
  /**
   * 重置表单数据到初始状态
   * 用于清空表单或取消编辑
   */
  const resetForm = () => {
    Object.assign(formData, initialData)
  }
  
  /**
   * 用编辑数据填充表单
   * @param data 要填充的编辑数据，可以是部分数据
   */
  const fillForm = (data?: Partial<T>) => {
    if (!data) {
      resetForm()
      return
    }
    
    // 如果提供了数据转换函数，使用它处理数据
    const transformedData = transformData 
      ? transformData(data)
      : data
      
    // 先重置表单，再填充数据，避免残留旧数据
    resetForm()
    Object.assign(formData, transformedData)
  }

  // 监听表单类型和编辑数据的变化
  if (formType) {
    const editDataRef = injectedEditData || options.editData
    
    if (editDataRef) {
      watch(
        [formType, editDataRef],
        ([type, data]) => {
          // console.log('useFormData:', type, 'editData:', data)
          
          // 编辑或查看模式下，填充数据
          if (type === 'edit' || type === 'view') {
            if (data) {
              fillForm(data)
            }
          } else {
            // 新增模式下，重置表单
            resetForm()
          }
        },
        { immediate: true }
      )
    }
  }
  
  return {
    formData,
    resetForm,
    fillForm,
    initialData
  }
} 