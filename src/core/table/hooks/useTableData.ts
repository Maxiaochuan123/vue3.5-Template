import { reactive, ref, type Ref } from 'vue';

/**
 * 通用的请求参数接口，包含分页相关参数
 * @example
 * ```ts
 * // 基础使用
 * const params: RequestParams = {
 *   page: 1,
 *   pageSize: 10
 * }
 * 
 * // 带查询条件
 * const params: RequestParams = {
 *   page: 1,
 *   pageSize: 10,
 *   keyword: 'search text',
 *   status: 'active',
 *   dateRange: [startTime, endTime]
 * }
 * ```
 */
export interface RequestParams {
  page: number;          // 当前页码
  pageSize: number;      // 每页条数
  [key: string]: any;    // 其他可能的查询参数
}

/**
 * 通用的响应数据接口
 * @example
 * ```ts
 * // 用户列表响应
 * interface UserListResponse extends ResponseData<User> {
 *   list: User[];    // 用户列表数据
 *   total: number;   // 总用户数
 * }
 * 
 * // API 响应示例
 * {
 *   list: [
 *     { id: 1, name: 'John', age: 30 },
 *     { id: 2, name: 'Jane', age: 25 }
 *   ],
 *   total: 100
 * }
 * ```
 */
export interface ResponseData<T> {
  list: T[];            // 数据列表
  total: number;        // 总条数
}

/**
 * 分页配置接口
 * @example
 * ```ts
 * const pagination: PaginationProps = {
 *   page: 1,
 *   pageSize: 10,
 *   pageSizes: [10, 20, 50],
 *   showSizePicker: true,
 *   itemCount: 100,
 *   prefix: ({ itemCount }) => `共 ${itemCount} 条`
 * }
 * ```
 */
export interface PaginationProps {
  page: number;         // 当前页码
  pageSize: number;     // 每页条数
  pageSizes?: number[]; // 可选的每页条数选项
  showSizePicker?: boolean;  // 是否显示每页条数选择器
  itemCount: number;    // 总条数
  prefix?: ({ itemCount }: { itemCount: number }) => string; // 自定义前缀文本
}

/**
 * Hook 配置项接口
 * @example
 * ```ts
 * // 基础用法
 * const options: UseTableDataOptions<User> = {
 *   fetchApi: (params) => axios.get('/api/users', { params }),
 *   defaultPageSize: 10
 * }
 * 
 * // 带参数转换
 * const options: UseTableDataOptions<User> = {
 *   fetchApi: (params) => axios.get('/api/users', { params }),
 *   transformParams: (params) => ({
 *     ...params,
 *     startTime: params.dateRange?.[0],
 *     endTime: params.dateRange?.[1]
 *   })
 * }
 * ```
 */
export interface UseTableDataOptions<T extends Record<string, any>, P = RequestParams> {
  fetchApi: (params: P) => Promise<ResponseData<T>>;  // 获取数据的方法
  defaultPageSize?: number;                           // 默认每页条数
  defaultPagination?: Partial<PaginationProps>;       // 默认分页配置
  transformParams?: (params: any) => P;               // 请求参数转换函数
  message?: {
    error: (msg: string) => void;                     // 错误提示方法
  };
}

/**
 * Hook 返回值接口
 */
export interface UseTableDataReturn<T> {
  loading: Ref<boolean>;       // 加载状态
  data: Ref<T[]>;             // 表格数据
  pagination: PaginationProps; // 分页配置
  loadData: (params?: any) => Promise<void>;          // 加载数据方法
  handlePageChange: (page: number) => void;           // 页码改变处理
  handlePageSizeChange: (pageSize: number) => void;   // 每页条数改变处理
  refresh: () => Promise<void>;                       // 刷新当前数据
  reset: () => Promise<void>;                         // 重置并加载数据
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
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * interface User {
 *   id: number
 *   name: string
 *   age: number
 * }
 * 
 * // 定义获取数据的 API
 * const fetchUsers = (params: RequestParams) => 
 *   axios.get<ResponseData<User>>('/api/users', { params })
 * 
 * // 使用 Hook
 * const {
 *   data,
 *   loading,
 *   pagination,
 *   loadData,
 *   refresh
 * } = useTableData<User>({
 *   fetchApi: fetchUsers,
 *   defaultPageSize: 10,
 *   transformParams: (params) => ({
 *     ...params,
 *     startTime: params.dateRange?.[0],
 *     endTime: params.dateRange?.[1]
 *   })
 * })
 * 
 * // 搜索处理
 * const handleSearch = (values) => {
 *   loadData(values)
 * }
 * </script>
 * 
 * <template>
 *   <div>
 *     <SearchForm @search="handleSearch" />
 *     
 *     <NDataTable
 *       :loading="loading"
 *       :data="data"
 *       :pagination="pagination"
 *       @update:page="handlePageChange"
 *       @update:page-size="handlePageSizeChange"
 *     />
 *   </div>
 * </template>
 * ```
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
   * @example
   * ```ts
   * // 基础查询
   * loadData({ keyword: 'search' })
   * 
   * // 带日期范围的查询
   * loadData({
   *   keyword: 'search',
   *   dateRange: [startTime, endTime],
   *   status: 'active'
   * })
   * ```
   */
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
    currentParams.value = cleanParams; // 保存当前查询参数

    try {
      // 分页参数由内部管理，与外部查询参数合并
      const requestParams = {
        ...cleanParams,      // 先放查询参数
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      // 转换参数（如果提供了转换函数）
      const finalParams = transformParams ? transformParams(requestParams) : requestParams;
      const { list, total } = await fetchApi(finalParams as P);

      data.value = list;
      pagination.itemCount = total;
    } catch (error) {
      if (message) message.error(error instanceof Error ? error.message : '加载数据失败');
      data.value = [];
      pagination.itemCount = 0;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 使用当前参数刷新数据
   * @example
   * ```ts
   * // 在数据更新后刷新表格
   * await handleDelete(id)
   * refresh()
   * ```
   */
  const refresh = () => loadData(currentParams.value);

  /**
   * 重置分页并加载数据
   * @example
   * ```ts
   * // 重置表格到初始状态
   * searchForm.value.reset()
   * reset()
   * ```
   */
  const reset = async () => {
    pagination.page = 1;
    pagination.pageSize = defaultPageSize;
    currentParams.value = {};  // 清空搜索参数
    return loadData({});
  };

  /**
   * 页码改变处理
   * @param page 新的页码
   */
  const handlePageChange = (page: number) => {
    pagination.page = page;
    loadData(currentParams.value);  // 使用当前的搜索参数
  };

  /**
   * 每页条数改变处理
   * @param pageSize 新的每页条数
   */
  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;  // 切换每页条数时重置到第一页
    loadData(currentParams.value);  // 使用当前的搜索参数
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
