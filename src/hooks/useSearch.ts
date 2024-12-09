import { reactive, toRaw } from 'vue';
import type { Ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { useFormReset } from './useFormReset';

interface UseSearchOptions<T extends Record<string, any>> {
  defaultValues?: Partial<T>;
  onSearch?: (values: T) => void;
  searchFormRef?: Ref<FormInst | null>;
}

export function useSearch<T extends Record<string, any>>(options: UseSearchOptions<T> = {}) {
  const { defaultValues = {} as T, onSearch, searchFormRef } = options;

  // 搜索表单数据
  const searchForm = reactive({ ...defaultValues }) as unknown as T;

  // 查询方法
  const handleSearch = () => {
    onSearch?.(toRaw(searchForm));
  };

  // 使用 useFormReset hook
  const { reset } = useFormReset({
    formRef: searchFormRef!,
    defaultValues,
    formData: searchForm,
    onReset: () => onSearch?.(toRaw(searchForm))
  });

  return {
    searchForm,
    handleSearch,
    handleReset: reset
  };
}
