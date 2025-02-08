import { ref, reactive, type Ref, type VNodeChild } from 'vue';
import type { ListResponse } from '@/api/types'
import type { PaginationInfo } from 'naive-ui'

export interface RequestParams {
  // 当前页码
  pageIndex: number;          
  // 每页条数
  pageSize: number;     
  // 其他可能的查询参数
  [key: string]: any;    
}

// 配置项接口
export interface UseTableDataOptions<T extends Record<string, any>, P = RequestParams> {
  // 获取数据的方法
  fetchApi: (params: P) => Promise<ListResponse<T>>; 
  // 默认每页条数
  defaultPageSize?: number;                          
  // 默认分页配置
  defaultPagination?: Partial<PaginationProps>;      
  // 请求参数转换函数
  transformParams?: (params: any) => P;              
  // 错误提示方法
  message?: {
    // 错误提示方法
    error: (msg: string) => void;
  };
}

// 分页配置类型
interface PaginationProps {
  page: number
  pageSize: number
  showSizePicker: boolean
  pageSizes: number[]
  itemCount: number
  // pageCount: number
  onChange: (page: number) => void
  onUpdatePageSize: (pageSize: number) => void
  prefix?: (info: PaginationInfo) => VNodeChild
  [key: string]: any
}

/**
 * Hook 返回值接口
 */
export interface UseTableDataReturn<T> {
  // 加载状态
  loading: Ref<boolean>;       
  // 表格数据
  data: Ref<T[]>;             
  // 分页配置
  pagination: PaginationProps; 
  // 加载数据方法
  loadData: (params?: any) => Promise<void>;         
  // 页码改变处理
  handlePageChange: (pageIndex: number) => void;          
  // 每页条数改变处理
  handlePageSizeChange: (pageSize: number) => void;  
  // 刷新当前数据
  refresh: () => Promise<void>;                      
  // 重置并加载数据
  reset: () => Promise<void>;                        
}

/**
 * 表格数据管理 Hook
 * 
 * 用于管理表格数据的获取和分页，功能包括：
 * 1. 数据加载和刷新
 * 2. 分页管理
 * 3. 查询参数处理
 * 4. 加载状态管理
 * 5. 错误处理
 */
export function useTableData<T extends Record<string, any>, P = RequestParams>(
  options: UseTableDataOptions<T, P>
): UseTableDataReturn<T> {
  const {
    fetchApi,
    defaultPageSize = 10,
    defaultPagination = {},
    transformParams,
    message
  } = options;

  // 加载状态
  const loading = ref(false);                          
  // 表格数据
  const data = ref<T[]>([]) as Ref<T[]>;              
  // 当前查询参数
  const currentParams = ref<Record<string, any>>({}); 

  // 分页配置初始化
  const pagination = reactive<PaginationProps>({
    page: 1,
    pageSize: defaultPageSize,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 40],
    itemCount: 0,
    showQuickJumper: true,
    onChange: (page: number) => {
      handlePageChange(page);
    },

    onUpdatePageSize: (pageSize: number) => {
      handlePageSizeChange(pageSize);
    },
    prefix(info: PaginationInfo): VNodeChild {
      return `共 ${info.itemCount} 条`
    },
    ...defaultPagination
  });

  // 加载表格数据
  const loadData = async (params = {}) => {
    // 添加参数验证和清理
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null)
    )
    
    loading.value = true;
    // 如果是新的搜索参数（不是分页触发的），重置到第一页
    if (JSON.stringify(cleanParams) !== JSON.stringify(currentParams.value)) {
      pagination.page = 1;
    }
    // 保存当前查询参数
    currentParams.value = cleanParams;

    try {
      // 分页参数由内部管理，与外部查询参数合并，并转换为 API 需要的格式
      const requestParams = {
        ...cleanParams,
        // 转换为 API 需要的 pageIndex
        pageIndex: pagination.page,
        pageSize: pagination.pageSize,
      };

      // 转换参数（如果提供了转换函数）
      const finalParams = transformParams ? transformParams(requestParams) : requestParams;
      const { data: _data } = await fetchApi(finalParams as P);
      data.value = _data.records || [];
      pagination.itemCount = _data.total || 0;
      
      console.log('Pagination data:', {
        total: _data.total,
        itemCount: pagination.itemCount,
        currentPage: pagination.page,
        pageSize: pagination.pageSize
      });
    } catch (error) {
      if (message) message.error(error instanceof Error ? error.message : '加载数据失败');
      data.value = [];
      pagination.itemCount = 0;
    } finally {
      loading.value = false;
    }
  };

  // 使用当前参数刷新数据
  const refresh = () => loadData(currentParams.value);

  // 重置分页并加载数据
  const reset = async () => {
    pagination.page = 1;
    pagination.pageSize = defaultPageSize;
    console.log('pagination:', pagination)
    // 清空搜索参数
    // currentParams.value = {}; 
    // 加载数据
    return loadData({});
  };

  // 页码改变处理
  const handlePageChange = (pageIndex: number) => {
    // 设置分页页码
    pagination.page = pageIndex;
    // 使用当前的搜索参数
    loadData(currentParams.value); 
  };

  // 每页条数改变处理
  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    // 切换每页条数时重置到第一页
    pagination.page = 1; 
    // 使用当前的搜索参数
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
