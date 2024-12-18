import { reactive, ref } from 'vue';
import type { Ref } from 'vue';

// 通用的请求参数接口，包含分页相关参数
export interface RequestParams {
  page: number;          // 当前页码
  pageSize: number;      // 每页条数
  [key: string]: any;    // 其他可能的查询参数
}

// 通用的响应数据接口
export interface ResponseData<T> {
  list: T[];            // 数据列表
  total: number;        // 总条数
}

// 分页配置接口
export interface PaginationProps {
  page: number;         // 当前页码
  pageSize: number;     // 每页条数
  pageSizes?: number[]; // 可选的每页条数选项
  showSizePicker?: boolean;  // 是否显示每页条数选择器
  itemCount: number;    // 总条数
  prefix?: ({ itemCount }: { itemCount: number }) => string; // 自定义前缀文本
}

// Hook 配置项接口
export interface UseTableDataOptions<T, P = RequestParams> {
  fetchData: (params: P) => Promise<ResponseData<T>>;  // 获取数据的方法
  defaultPageSize?: number;                            // 默认每页条数
  defaultPagination?: Partial<PaginationProps>;        // 默认分页配置
  transformParams?: (params: any) => P;                // 请求参数转换函数
}

// Hook 返回值接口
export interface UseTableDataReturn<T> {
  loading: Ref<boolean>;      // 加载状态
  data: Ref<T[]>;            // 表格数据
  pagination: PaginationProps;// 分页配置
  loadData: (params?: any) => Promise<void>;           // 加载数据方法
  handlePageChange: (page: number) => void;            // 页码改变处理
  handlePageSizeChange: (pageSize: number) => void;    // 每页条数改变处理
  refresh: () => Promise<void>;                        // 刷新当前数据
  reset: () => Promise<void>;                         // 重置并加载数据
}

/**
 * 表格数据管理 Hook
 * @param options Hook 配置项
 * @returns UseTableDataReturn 包含表格数据和操作方法的对象
 */
export function useTableData<T extends Record<string, any>, P = RequestParams>(
  options: UseTableDataOptions<T, P>
): UseTableDataReturn<T> {
  const {
    fetchData,
    defaultPageSize = 10,
    defaultPagination = {},
    transformParams
  } = options;

  // 状态定义
  const loading = ref(false);                          // 加载状态
  const data = ref<T[]>([]) as Ref<T[]>;              // 表格数据
  const currentParams = ref<Record<string, any>>({});  // 当前查询参数

  // 分页配置初始化
  const pagination = reactive<PaginationProps>({
    page: 1,
    pageSize: defaultPageSize,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 40],
    itemCount: 0,
    prefix({ itemCount }) {
      return `共 ${itemCount} 条`;
    },
    ...defaultPagination
  });

  /**
   * 加载表格数据
   * @param params 查询参数
   */
  const loadData = async (params = {}) => {
    // console.log('loadData', params);
    
    loading.value = true;
    currentParams.value = params; // 保存当前查询参数

    try {
      // 分页参数由内部管理，与外部查询参数合并
      const requestParams = {
        ...params,           // 先放查询参数
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      // 转换参数（如果提供了转换函数）
      const finalParams = transformParams ? transformParams(requestParams) : requestParams;
      const { list, total } = await fetchData(finalParams as P);

      data.value = list;
      pagination.itemCount = total;
    } catch (error) {
      console.error('加载数据失败:', error);
      data.value = [];
      pagination.itemCount = 0;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 使用当前参数刷新数据
   */
  const refresh = () => loadData(currentParams.value);

  /**
   * 重置分页并加载数据
   */
  const reset = async () => {
    pagination.page = 1;
    pagination.pageSize = defaultPageSize;
    return loadData({});
  };

  /**
   * 页码改变处理
   * @param page 新的页码
   */
  const handlePageChange = (page: number) => {
    pagination.page = page;
    loadData(currentParams.value);
  };

  /**
   * 每页条数改变处理
   * @param pageSize 新的每页条数
   */
  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    loadData(currentParams.value);
  };

  // 初始化时加载数据
  loadData();

  return {
    loading,
    data,
    pagination,
    loadData,
    handlePageChange,
    handlePageSizeChange,
    refresh,
    reset
  };
}
