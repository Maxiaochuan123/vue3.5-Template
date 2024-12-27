import { post, get, put } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { AuditStatusType, AdvertisingType } from '@/enum/options'

export interface AdvertisingPlacement {
  id?: number
  adverInfoId: number
  type: AdvertisingType | null
  price: number | null
}

export interface BaseAdvertPlacementSearch {
  key?: string | null
  dateRange?: [number, number] | null
  status?: AuditStatusType | null
  type?: AdvertisingType | null
}

export interface AdvertPlacementSearch extends ListRequest, BaseAdvertPlacementSearch {}

export interface BillingMethod {
  cpa: string
  cpc: string
  cpm: string
}

export const advertisingPlacementApi = {
  /**
   * 获取广告投放列表
   */
  getAdvertisingPlacementList(params: AdvertPlacementSearch): Promise<ListResponse<AdvertisingPlacement>> {
    return get('/api/v1/advertPlacement/page', params)
  },

  /**
   * 获取计费方式
   */
  getBillingMethod(): Promise<ApiResult<BillingMethod>> {
    return get('/api/v1/advertPlacement/method')
  },

  /**
   * 创建广告投放
   */
  createAdvertisingPlacement(data: AdvertisingPlacement): Promise<ApiResult<void>> {
    return post('/api/v1/advertPlacement', data)
  },

  /**
   * 编辑广告投放
   */
  updateAdvertisingPlacement(data: AdvertisingPlacement): Promise<ApiResult<void>> {
    return put('/api/v1/advertPlacement', data)
  },
}
