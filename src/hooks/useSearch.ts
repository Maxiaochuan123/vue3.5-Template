import { reactive } from 'vue';
import type { Ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { useDebounceFn } from '@vueuse/core'

/**
 * 搜索表单配置选项接口
 * @template T 原始表单数据类型
 * @template P 转换后的参数类型，默认与原始类型相同
 */
interface UseSearchOptions<T extends Record<string, any>, P extends Record<string, any> = T> {
  /** 表单默认值 */
  defaultValues?: Partial<T>;
  /** 搜索回调函数，接收转换后的参数 */
  onSearch?: (values: P) => void;
  /** naive-ui 的表单实例引用 */
  searchFormRef?: Ref<FormInst | null>;
  /** 防抖延迟时间（毫秒） */
  debounceTime?: number;
  /** 参数转换函数，用于在搜索前转换参数格式 */
  transformParams?: (params: T) => P;
}

/**
 * 搜索表单钩子函数
 * 
 * @description
 * 用于处理搜索表单的状态管理、参数转换和提交功能的组合式函数。
 * 主要功能：
 * 1. 管理表单状态
 * 2. 处理表单重置
 * 3. 支持参数转换
 * 4. 自动清理空值
 * 5. 防抖处理
 * 
 * @example
 * ```typescript
 * // 基础用法
 * const { searchForm, handleSearch, handleReset } = useSearch({
 *   defaultValues: {
 *     keyword: '',
 *     status: null
 *   },
 *   onSearch: (values) => {
 *     console.log('搜索参数:', values)
 *   }
 * });
 * 
 * // 带参数转换的用法
 * interface SearchForm {
 *   keyword: string;
 *   dateRange: [number, number] | null;
 *   status: string;
 * }
 * 
 * interface ApiParams {
 *   keyword: string;
 *   startDate: number;
 *   endDate: number;
 *   status: string;
 * }
 * 
 * const { searchForm, handleSearch } = useSearch<SearchForm, ApiParams>({
 *   defaultValues: {
 *     keyword: '',
 *     dateRange: null,
 *     status: ''
 *   },
 *   transformParams: (params) => ({
 *     ...params,
 *     startDate: params.dateRange?.[0] || null,
 *     endDate: params.dateRange?.[1] || null
 *   }),
 *   onSearch: (values) => {
 *     // values 已经转换为 ApiParams 类型
 *     api.fetchList(values)
 *   }
 * });
 * 
 * 比如 时间字段前端组件是 dateRange，后端接口需要 startDate 和 endDate，就需要用到转换函数，转换后会自动处理，提交的字段中不会包含 dataRange
 * const transformParams = (params: any) => {
 *   console.log('transformParams:', params)
 *   const { dateRange, ...rest } = params;
 *   return {
 *     ...rest,
 *     startDate: dateRange?.[0] || null,
 *     endDate: dateRange?.[1] || null
 *   }
 * }
 * <SearchForm :model="defaultSearchForm" :transform-params="transformParams" :on-search="handleSearch">
 * ```
 * 
 * @template T 原始表单数据类型
 * @template P 转换后的参数类型，默认与原始类型相同
 * @param options 配置选项
 * @returns 返回表单状态和操作方法
 */
export function useSearch<T extends Record<string, any>, P extends Record<string, any> = T>(options: UseSearchOptions<T, P> = {}) {
  const { defaultValues, onSearch, searchFormRef, debounceTime = 300, transformParams } = options;

  // 初始化表单状态
  const initialValues = defaultValues || {} as Partial<T>;
  const searchForm = reactive({ ...initialValues }) as T;

  // 使用防抖包装搜索函数
  const debouncedSearch = useDebounceFn(() => {
    // 创建一个不包含空值的表单数据副本
    const cleanSearchForm = { ...searchForm };
    (Object.keys(cleanSearchForm) as (keyof T)[]).forEach(key => {
      if (cleanSearchForm[key] == null) {
        delete cleanSearchForm[key];
      }
    });

    if (transformParams) {
      try {
        // 1. 获取转换后的值
        const transformedValues = transformParams(cleanSearchForm);
        
        // 2. 找出转换后新增的字段
        const newKeys = (Object.keys(transformedValues) as (keyof P)[]).filter(key => !(key in cleanSearchForm));
        
        // 3. 找出需要被移除的源字段
        const keysToRemove = (Object.keys(cleanSearchForm) as (keyof T)[]).filter(originalKey => {
          const value = cleanSearchForm[originalKey];
          // 如果原始值是 null 或 undefined，不应该被移除
          if (value == null) return false;
          
          return newKeys.some(newKey => {
            const transformedValue = transformedValues[newKey];
            if (Array.isArray(value)) {
              return value.includes(transformedValue as any);
            }
            return value === transformedValue;
          });
        });

        // 4. 创建最终的参数对象
        const finalParams = { ...transformedValues };
        keysToRemove.forEach(key => {
          delete finalParams[key as keyof P];
        });

        // 5. 移除所有值为 null 或 undefined 的字段
        (Object.keys(finalParams) as (keyof P)[]).forEach(key => {
          if (finalParams[key] == null) {
            delete finalParams[key];
          }
        });

        onSearch?.(finalParams);
      } catch (error) {
        console.error('Error in transformParams:', error);
        // 如果转换失败，使用清理过的表单数据
        onSearch?.(cleanSearchForm as unknown as P);
      }
    } else {
      onSearch?.(cleanSearchForm as unknown as P);
    }
  }, debounceTime);

  /**
   * 触发搜索
   * 会自动应用防抖和参数转换
   */
  const handleSearch = () => {
    debouncedSearch();
  };

  /**
   * 重置表单
   * 1. 恢复默认值
   * 2. 清除验证状态
   * 3. 触发搜索
   */
  const handleReset = () => {
    // 重置表单值为初始值
    for (const key in searchForm) {
      if (key in initialValues) {
        searchForm[key] = initialValues[key]!;
      } else {
        delete searchForm[key];
      }
    }
    
    // 重置表单验证状态
    if (searchFormRef?.value) {
      searchFormRef.value.restoreValidation();
    }

    // 触发搜索
    handleSearch();
  };

  return {
    /** 表单响应式数据 */
    searchForm,
    /** 触发搜索方法 */
    handleSearch,
    /** 重置表单方法 */
    handleReset
  };
}
