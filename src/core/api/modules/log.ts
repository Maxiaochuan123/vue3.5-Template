import { get } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'

// 日志信息类型
export interface Log {
  id?: number
  name: string
  message: string
  typeId: 1 | 2 | 3 // 1 操作日志 2 异常日志 3 登录日志
  createTime: string,
  ipAddress: string
}

// 基础日志搜索参数
export interface BaseLogSearch {
  name?: string | null
  message?: string | null
  typeId?: 1 | 2 | 3 | null // 1 操作日志 2 异常日志 3 登录日志
  dateRange?: string | null
}
  
// 日志列表查询参数
export type LogListQuery = ListRequest & Partial<BaseLogSearch>

export const logApi = {
  /**
  * 获取日志列表
  */
  getLogList(params: LogListQuery): Promise<ListResponse<Log>> {
    return get('/api/v1/logs/page', params)
  },
}