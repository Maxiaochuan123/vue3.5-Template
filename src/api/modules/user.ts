import { get } from '@/api/server'
import type { ApiResult } from '@/api/types'


export const userApi = {
  /**
   * 获取用户余额
   */
  getUserBalance(): Promise<ApiResult> {
    return get('/api/v1/mjUser/balance')
  },
}
