import type { Ref } from 'vue';
import type { FormInst } from 'naive-ui';

interface UseFormResetOptions<T extends Record<string, any>> {
  formRef?: Ref<FormInst | null>;
  defaultValues: T;
  formData: T;
  onReset?: (values: T) => void;
}

export function useFormReset<T extends Record<string, any>>(options: UseFormResetOptions<T>) {
  const { formRef, defaultValues, formData, onReset } = options;

  const reset = () => {
    console.log(formData);
    
    // 重置表单验证
    formRef?.value?.restoreValidation();

    // 重置表单数据
    const defaultKeys = Object.keys(defaultValues);
    defaultKeys.forEach(key => {
      (formData as any)[key] = defaultValues[key] ?? null;
    });

    // 触发重置回调
    onReset?.(formData);
  };

  return {
    reset
  };
}
