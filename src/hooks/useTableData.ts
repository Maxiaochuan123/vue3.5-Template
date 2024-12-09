import { reactive, ref } from 'vue';
import type { Ref } from 'vue';

// 将通用类型提取出来
export interface RequestParams {
  page: number;
  pageSize: number;
  [key: string]: any;
}

export interface ResponseData<T> {
  list: T[];
  total: number;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  pageSizes?: number[];
  showSizePicker?: boolean;
  itemCount: number;
  prefix?: ({ itemCount }: { itemCount: number }) => string;
}

export interface UseTableDataOptions<T, P = RequestParams> {
  // 让 fetchData 的参数类型可配置
  fetchData: (params: P) => Promise<ResponseData<T>>;
  defaultPageSize?: number;
  defaultPagination?: Partial<PaginationProps>;
  // 添加转换函数，处理请求参数
  transformParams?: (params: any) => P;
}

export interface UseTableDataReturn<T> {
  loading: Ref<boolean>;
  data: Ref<T[]>;
  pagination: PaginationProps;
  loadData: (params?: any) => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  // 添加刷新方法
  refresh: () => Promise<void>;
  // 添加重置方法
  reset: () => Promise<void>;
}

export function useTableData<T extends Record<string, any>, P = RequestParams>(
  options: UseTableDataOptions<T, P>
): UseTableDataReturn<T> {
  const {
    fetchData,
    defaultPageSize = 10,
    defaultPagination = {},
    transformParams
  } = options;

  const loading = ref(false);
  const data = ref<T[]>([]) as Ref<T[]>;
  const currentParams = ref<Record<string, any>>({});

  // 分页配置
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

  // 加载数据
  const loadData = async (params = {}) => {
    loading.value = true;
    currentParams.value = params; // 保存查询参数

    try {
      const requestParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...params
      };

      const finalParams = transformParams ? transformParams(requestParams) : requestParams;
      const { list, total } = await fetchData(finalParams as P);

      data.value = list;
      pagination.itemCount = total;
    } catch (error) {
      console.error('加载数据失败:', error);
      // 可以添加错误处理回调
      data.value = [];
      pagination.itemCount = 0;
    } finally {
      loading.value = false;
    }
  };

  // 刷新当前数据
  const refresh = () => loadData(currentParams.value);

  // 重置并加载数据
  const reset = async () => {
    pagination.page = 1;
    pagination.pageSize = defaultPageSize;
    return loadData({});
  };

  // 页码改变
  const handlePageChange = (page: number) => {
    pagination.page = page;
    loadData(currentParams.value);
  };

  // 每页条数改变
  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    loadData(currentParams.value);
  };

  // 默认加载数据
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
