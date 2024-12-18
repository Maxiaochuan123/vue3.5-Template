import type { FormItemRule, FormInst } from 'naive-ui'
import type { Ref } from 'vue'

/**
 * MediaUploader 组件验证器的配置选项接口
 */
interface MediaValidatorOptions {
  /** 表单实例引用 */
  formRef: Ref<FormInst | null>
  /** 表单验证字段的 key */
  key: string
  /** 是否必填，默认 false */
  required?: boolean 
  /** 验证失败时的提示信息 */
  message?: string
  /** 需要上传的文件数量，默认 1 */
  requiredCount?: number
}

/**
 * MediaUploader 组件的表单验证 hook
 * @description 用于验证媒体上传组件的文件数量和必填状态
 * @example
 * ```ts
 * const rules = {
 *   media: useMediaUploaderValidator({
 *     formRef,
 *     key: 'media',
 *     required: true,
 *     message: '请上传文件',
 *     requiredCount: 1
 *   })
 * }
 * ```
 */
export function useMediaUploaderValidator(options: MediaValidatorOptions) {
  const {
    formRef,
    key,
    required = false,
    message = '请上传文件',
    requiredCount = 1
  } = options

  // 创建一个用于重新验证的函数
  const revalidate = () => {
    if (formRef.value) {
      formRef.value.validate((errors) => {
        if (errors) {
          console.error(errors)
        }
      }, (rule) => rule?.key === key)
    }
  }

  // 创建 MediaUploader 的验证规则
  const rule: FormItemRule = {
    key,
    required,
    message,
    trigger: ['change', 'blur'],
    validator(rule: FormItemRule, value: string[]) {
      // 如果值不是数组或者是空数组，返回默认消息
      if (!Array.isArray(value)) {
        return new Error(message)
      }
      
      // 如果是空数组且不是必填，直接通过
      if (value.length === 0 && !required) {
        return true
      }
      
      // 如果是空数组且必填，返回默认消息
      if (value.length === 0 && required) {
        return new Error(message)
      }
      
      // 如果数组不为空但数量不足，更新规则消息并返回错误
      if (value.length < requiredCount) {
        rule.message = `请上传${requiredCount}个文件，当前已上传${value.length}个`
        return new Error(rule.message)
      }
      
      // 重置为默认消息并返回验证通过
      rule.message = message
      return true
    }
  }

  return {
    rule,
    revalidate
  }
}