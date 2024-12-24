import { ref } from 'vue'
import { type FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useDebounceFn } from '@vueuse/core'

/**
 * 自定义表单实例接口
 * 用于支持非 naive-ui 的表单组件
 */
interface CustomFormInst {
  validate: () => Promise<void>
  formData: any
  initialData?: Record<string, any>
}

/**
 * 表单提交配置接口
 * @example
 * ```ts
 * const { handleSubmit, submitLoading } = useFormSubmit()
 * 
 * // 在表单提交时调用
 * const onSubmit = () => {
 *   handleSubmit({
 *     // 提交 API
 *     submitApi: (data) => axios.post('/api/user', data),
 *     // 表单实例
 *     formRef: formRef.value,
 *     // 表单数据
 *     formData: formData,
 *     // 成功回调
 *     onSuccess: () => {
 *       drawer.value?.close()
 *       emit('success')
 *     },
 *     // 表单类型
 *     formType: 'add',
 *     // 需要保留的额外字段（编辑时）
 *     extraFields: ['id', 'createTime'],
 *     // 原始数据（编辑时）
 *     originalData: props.editData,
 *     // 初始数据结构
 *     initialData: defaultFormData
 *   })
 * }
 * ```
 */
interface FormSubmitOptions {
  /** 
   * 提交数据的 API 函数
   * @example
   * ```ts
   * submitApi: (data) => axios.post('/api/user', data)
   * ```
   */
  submitApi: (...args: any[]) => Promise<any>

  /** 表单实例，用于验证表单 */
  formRef: FormInst | CustomFormInst | null

  /** 要提交的表单数据 */
  formData: any

  /** 
   * 提交成功的回调函数
   * @example
   * ```ts
   * onSuccess: () => {
   *   drawer.value?.close()
   *   emit('success')
   * }
   * ```
   */
  onSuccess?: () => void

  /** 成功提示信息 */
  successMessage?: string

  /** 失败提示信息 */
  errorMessage?: string

  /** 表单类型：新增或编辑 */
  formType?: 'add' | 'edit'

  /** 
   * 编辑时需要保留的额外字段
   * @example ['id', 'createTime', 'updateTime']
   */
  extraFields?: string[]

  /** 编辑时的原始数据 */
  originalData?: Record<string, any>

  /** 
   * 初始数据结构，用于过滤提交字段
   * @example
   * ```ts
   * {
   *   username: '',
   *   password: '',
   *   remember: false
   * }
   * ```
   */
  initialData?: Record<string, any>
}

/**
 * 表单提交 Hook
 * 
 * 用于处理表单提交的通用逻辑，包括：
 * 1. 表单验证
 * 2. 提交状态管理
 * 3. 数据处理和过滤
 * 4. 错误处理
 * 5. 防抖处理
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const formRef = ref<FormInst | null>(null)
 * const { handleSubmit, submitLoading } = useFormSubmit()
 * 
 * const onSubmit = () => {
 *   handleSubmit({
 *     submitApi: createUser,
 *     formRef: formRef.value,
 *     formData: formData,
 *     onSuccess: () => {
 *       message.success('创建成功')
 *       drawer.value?.close()
 *     }
 *   })
 * }
 * </script>
 * 
 * <template>
 *   <NForm ref="formRef" :model="formData">
 *     <NFormItem>
 *       <NButton 
 *         :loading="submitLoading"
 *         @click="onSubmit"
 *       >
 *         提交
 *       </NButton>
 *     </NFormItem>
 *   </NForm>
 * </template>
 * ```
 */
export function useFormSubmit() {
  // 提交加载状态
  const submitLoading = ref(false)
  // 提交按钮禁用状态
  const submitDisabled = ref(false)
  // 消息提示
  const message = useMessage()

  /**
   * 处理表单提交
   * 使用防抖函数包装，避免重复提交
   */
  const handleSubmit = useDebounceFn(async (options: FormSubmitOptions) => {
    const {
      submitApi,
      formRef,
      formData,
      onSuccess,
      successMessage = '提交成功',
      errorMessage = '提交失败',
      formType,
      extraFields,
      originalData,
      initialData
    } = options

    if (!submitApi || !formRef) return
    
    try {
      // 设置提交状态
      submitLoading.value = true
      submitDisabled.value = true

      // 表单验证
      await formRef.validate()

      // console.log('api', submitApi)
      // console.log('formData', formData)

      // 处理提交数据
      let submitData: Record<string, any> = {}

      // 使用初始数据结构作为字段过滤依据
      const formFields = Object.keys(initialData || formData)
      
      // 只包含初始表单结构中定义的字段
      formFields.forEach(field => {
        if (formData[field] !== undefined) {
          submitData[field] = formData[field]
        }
      })

      // 如果是编辑模式且有需要保留的额外字段，则添加这些字段
      if (formType === 'edit' && extraFields && originalData) {
        extraFields.forEach(field => {
          if (originalData[field] !== undefined) {
            submitData[field] = originalData[field]
          }
        })
      }

      // 调用提交接口
      await submitApi(submitData)

      // 提交成功提示
      message.success(successMessage)

      // 执行成功回调
      onSuccess?.()

      return true
    } catch (error: any) {
      // 错误提示
      message.error(error.message || errorMessage)
      submitDisabled.value = false
      return false
    } finally {
      // 重置提交状态
      submitLoading.value = false
    }
  }, 300) // 300ms 的防抖时间

  return {
    submitLoading,
    submitDisabled,
    handleSubmit
  }
} 