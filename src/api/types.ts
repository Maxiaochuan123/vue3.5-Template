// 接口返回类型
export interface ApiResult<T = any> {
  code: number
  data: T
  msg: string
} 

// 列表分页参数
export interface ListRequest {
  pageIndex: number
  pageSize: number
}

// 列表 Response
export interface ListResponse<T> extends ApiResult<{
  records: T[]
  total: number
}> {}
