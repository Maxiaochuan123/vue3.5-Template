import { reactive, toRaw } from 'vue';
import type { Ref } from 'vue';
import type { FormInst } from 'naive-ui';

interface UseSearchOptions<T extends Record<string, any>> {
  defaultValues?: Partial<T>;
  onSearch?: (values: T) => void;
  searchFormRef?: Ref<FormInst | null>;
}

export function useSearch<T extends Record<string, any>>(options: UseSearchOptions<T> = {}) {
  const { defaultValues, onSearch, searchFormRef } = options;

  // 创建一个新的对象作为初始值
  const initialValues = defaultValues ? JSON.parse(JSON.stringify(defaultValues)) : {};
  
  // 搜索表单数据 - 使用新对象
  const searchForm = reactive({ ...initialValues }) as T;

  // 查询方法
  const handleSearch = () => {
    console.log(1);
    onSearch?.(toRaw(searchForm));
  };

  const handleReset = () => {
    console.log('handleReset called - before:', toRaw(searchForm));
    
    // 清空所有现有值
    Object.keys(searchForm).forEach(key => {
      delete searchForm[key];
    });
    
    // 重新设置初始值
    Object.keys(initialValues).forEach(key => {
      searchForm[key] = initialValues[key];
    });
    
    console.log('handleReset called - after:', toRaw(searchForm));
    
    // 如果有表单引用，同时调用表单的重置方法
    if (searchFormRef?.value) {
      searchFormRef.value.restoreValidation();
    }

    // 重置后触发搜索
    handleSearch();
    
  };

  return {
    searchForm,
    handleSearch,
    handleReset
  };
}
