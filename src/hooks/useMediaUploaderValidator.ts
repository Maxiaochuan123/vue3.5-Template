import type { FormItemRule, FormInst } from 'naive-ui'
import { watch } from 'vue'
import type { Ref } from 'vue'

/**
 * MediaUploader 组件的表单验证 hook
 * @param formRef - 表单实例引用
 * @param mediaValue - 媒体文件数组的响应式引用
 * @param key - 表单验证字段 key
 * @param message - 验证错误提示信息
 * @param requiredCount - 必须上传的文件数量
 */
export function useMediaUploaderValidator(
  formRef: Ref<FormInst | null>,
  mediaValue: () => string[],
  key: string,
  message: string = '请上传文件',
  requiredCount: number = 1,
) {
  // 创建 MediaUploader 的验证规则
  const rule: FormItemRule = {
    key,
    required: true,
    message,
    trigger: 'change',
    validator(rule: FormItemRule, value: string[]) {
      console.log('value', value)
      // 如果值不是数组或者是空数组，返回默认消息
      if (!Array.isArray(value)) {
        return new Error(message)
      }
      
      // 如果是空数组，返回默认消息
      if (value.length === 0) {
        return new Error(message)
      }
      
      // 如果数组不为空但数量不足，更新规则消息并返回错误
      if (value.length < requiredCount) {
        console.log(value.length, requiredCount);
        rule.message = `请上传${requiredCount}个文件，当前已上传${value.length}个`
        return new Error(rule.message)
      }
      
      // 重置为默认消息
      rule.message = message
      return true
    }
  }

  // 监听媒体文件变化自动触发验证
  watch(
    mediaValue,
    (newVal) => {
      if (formRef.value) {
        formRef.value.validate(
          (errors) => {
            if (errors) {
              console.error(errors)
            }
          },
          (rule) => {
            return rule?.key === key
          }
        )
      }
    },
    { deep: true }
  )

  return rule
} 