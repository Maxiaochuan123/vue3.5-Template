import { ref } from 'vue'
import { type FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'

interface FormSubmitOptions {
  submitApi: (...args: any[]) => Promise<any>
  formRef: FormInst | null
  formData: any
  onSuccess?: () => void
  successMessage?: string
  errorMessage?: string
  formType?: 'add' | 'edit'
  extraFields?: string[]
  originalData?: Record<string, any>
}

export function useFormSubmit() {
  const submitLoading = ref(false)
  const submitDisabled = ref(false)
  const message = useMessage()

  const handleSubmit = async (options: FormSubmitOptions) => {
    const {
      submitApi,
      formRef,
      formData,
      onSuccess,
      successMessage = '提交成功',
      errorMessage = '提交失败',
      formType,
      extraFields,
      originalData
    } = options

    if (!submitApi || !formRef) return
    
    try {
      submitLoading.value = true
      submitDisabled.value = true

      // 表单验证
      await formRef.validate()

      // 处理提交数据
      const submitData = {
        ...formData,
        // 如果是编辑模式且有额外字段，则添加额外字段
        ...(formType === 'edit' && extraFields && originalData
          ? Object.fromEntries(
              extraFields.map(field => [field, originalData[field]])
            )
          : {})
      }
      console.log('useFormSubmit 中的数据:', submitData)  // 添加这行日志
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
  }

  return {
    submitLoading,
    submitDisabled,
    handleSubmit
  }
} 