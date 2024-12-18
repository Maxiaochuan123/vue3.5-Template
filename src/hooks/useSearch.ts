import { reactive } from 'vue';
import type { Ref } from 'vue';
import type { FormInst } from 'naive-ui';

interface UseSearchOptions<T extends Record<string, any>> {
  defaultValues?: Partial<T>;
  onSearch?: (values: T) => void;
  searchFormRef?: Ref<FormInst | null>;
}

export function useSearch<T extends Record<string, any>>(options: UseSearchOptions<T> = {}) {
  const { defaultValues, onSearch, searchFormRef } = options;

  const initialValues = defaultValues || {} as Partial<T>;
  const searchForm = reactive({ ...initialValues }) as T;

  const handleSearch = () => {
    onSearch?.(searchForm);
  };

  const handleReset = () => {
    for (const key in searchForm) {
      if (key in initialValues) {
        searchForm[key] = initialValues[key]!;
      } else {
        delete searchForm[key];
      }
    }
    
    if (searchFormRef?.value) {
      searchFormRef.value.restoreValidation();
    }

    handleSearch();
  };

  return {
    searchForm,
    handleSearch,
    handleReset
  };
}
