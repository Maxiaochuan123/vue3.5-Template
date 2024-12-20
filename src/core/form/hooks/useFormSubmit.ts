import { ref } from 'vue'
import { type FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useDebounceFn } from '@vueuse/core'

// 定义通用表单组件接口
interface CustomFormInst {
  validate: () => Promise<void>
  formData: any
  initialData?: Record<string, any>
}

interface FormSubmitOptions {
  submitApi: (...args: any[]) => Promise<any>
  formRef: FormInst | CustomFormInst | null
  formData: any
  onSuccess?: () => void
  successMessage?: string
  errorMessage?: string
  formType?: 'add' | 'edit'
  extraFields?: string[]
  originalData?: Record<string, any>
  initialData?: Record<string, any>
}

export function useFormSubmit() {
  const submitLoading = ref(false)
  const submitDisabled = ref(false)
  const message = useMessage()

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
      submitLoading.value = true
      submitDisabled.value = true

      // 表单验证
      await formRef.validate()

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

      console.log('useFormSubmit 中的数据:', submitData)
      // 调用提交接口
      await submitApi(submitData)

      // 提交成功提示
      message.success(successMessage)

      // 执行成功回调
      onSuccess?.()

      return true
    } catch (error: any) {
      message.error(error.message || errorMessage)
      submitDisabled.value = false
      return false
    } finally {
      submitLoading.value = false
    }
  }, 300) // 300ms 的防抖时间

  return {
    submitLoading,
    submitDisabled,
    handleSubmit
  }
} 