import { get, post } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'

export interface AdvertiserManagement {
  id: number
  mobile: string
  customerId: number
  companyName: string
  giftAmount: string
  principalAmount: string
  totalAmount: string
  totalRecharge: string
  realName: string
}

export interface BaseAdvertiserManagementSearch {
  key?: string | null
  mobile?: string | null
}

export interface AdvertiserManagementSearch extends ListRequest, BaseAdvertiserManagementSearch {}

export const advertiserManagementApi = {
  /**
   * 获取充值管理列表
   */
  getAdvertiserManagementList(params: AdvertiserManagementSearch): Promise<ListResponse<AdvertiserManagement>> {
    return get('/api/v1/account/customer', params)
  },
  
  /**
   * 清空余额
   */
  clearBalance(data: { id: number }): Promise<ApiResult<void>> {
    return post('/api/v1/account/customerClear', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}