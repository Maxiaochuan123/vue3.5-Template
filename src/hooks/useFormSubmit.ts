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
      errorMessage = '提交失败'
    } = options

    if (!submitApi || !formRef) return
    
    try {
      submitLoading.value = true
      submitDisabled.value = true

      // 表单验证
      await formRef.validate()

      // 调用提交接口
      await submitApi(formData)

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