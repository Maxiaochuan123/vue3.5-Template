export interface ApiResult<T = any> {
  code: number
  data: T
  msg: string
} 