import { post, get, put } from '@/api/server'
import { dataGet } from '@/api/advertisingPlacementServer'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { AuditStatusType, AdvertisingType } from '@/enum/options'

export interface AdvertisingPlacement {
  id?: number
  adverInfoId: number
  type: AdvertisingType
  price: number
  placeEndTime: string
}

export interface AdvertisingPlacementFormState {
  adverInfoId: number | null
  type: AdvertisingType | null
  price: number | null
}

export interface BaseAdvertPlacementSearch {
  key?: string | null
  dateRange?: [] | null
  status?: AuditStatusType | null
  type?: AdvertisingType | null
}

export interface AdvertPlacementSearch extends ListRequest, BaseAdvertPlacementSearch {}

export interface BillingMethod {
  cpa: string
  cpc: string
  cpm: string
}

export interface RegionParams extends ListRequest {
  id: number
}

export interface CityParams extends RegionParams {
  province: string
}

export interface RegionData {
  rank: number
  name: string
  num: number
  percent: number
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
  createAdvertisingPlacement(data: AdvertisingPlacementFormState): Promise<ApiResult<void>> {
    return post('/api/v1/advertPlacement', data)
  },
}

// 广告投放数据
export const advertisingPlacementDataApi = {
  /**
   * 获取展现次数
   */
  getShowAcount(params: { id: number }): Promise<ApiResult> {
    return get('/api/v1/advert/showAcount', params)
  },

  /**
   * 获取点击次数
   */
  getClickAcount(params: { id: number }): Promise<ApiResult> {
    return get('/api/v1/advert/clickAcount', params)
  },

  /**
   * 获取下载次数
   */
  getDownloadAcount(params: { id: number }): Promise<ApiResult> {
    return get('/api/v1/advert/downloadAcount', params)
  },
  
  /**
   * 获取展现趋势数据
   */
  getShowTrend(params: { id: number }): Promise<ApiResult> {
    return dataGet('/common/v1/advert/showLine', params)
  },

  /**
   * 获取点击趋势数据 
   */
  getClickTrend(params: { id: number }): Promise<ApiResult> {
    return dataGet('/common/v1/advert/clickLine', params)
  },

  /**
   * 获取性别分布数据
   */
  getGenderDistribution(params: { id: number }): Promise<ApiResult> {
    return dataGet('/common/v1/advert/sexAccount', params)
  },

  /**
   * 获取访问设备分布数据
   */
  getDeviceDistribution(params: { id: number }): Promise<ApiResult> {
    return dataGet('/common/v1/advert/deviceAccount', params)
  },

  /**
   * 获取职业分布数据
   */
  getOccupationDistribution(params: { id: number }): Promise<ApiResult> {
    return dataGet('/common/v1/advert/occupation', params)
  },

  /**
   * 获取省级地区分布数据
   */
  getProvinceDistribution(params: RegionParams): Promise<ApiResult<{ records: RegionData[]; total: number }>> {
    return dataGet('/common/v1/advert/province', params)
  },

  /**
   * 获取城市分布数据
   */
  getCityDistribution(params: CityParams): Promise<ApiResult<{ records: RegionData[]; total: number }>> {
    return dataGet('/common/v1/advert/city', params)
  },

  /**
   * 获取年龄分布数据
   */
  getAgeDistribution(params: { id: number }): Promise<ApiResult> {
    return dataGet('/common/v1/advert/age', params)
  },
}
