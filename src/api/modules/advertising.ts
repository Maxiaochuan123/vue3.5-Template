import { post, get, put, del } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { AdvertisingType } from '@/enum/options'

export interface Advertising {
  id?: number
  username: string
  content: string
  createTime: string
  icon?: string
  status: number
  type: number | null
}

export interface SetAdvertAccount {
  nickname: string
  backgroundImg: string
}

export interface BaseAdvertSearch {
  key?: string | null
  dateRange?: [number, number] | null
  status?: number | null
  type?: AdvertisingType | null
}

export interface AdvertSearch extends ListRequest, BaseAdvertSearch {}

export const advertisingApi = {
  /**
   * 获取广告列表
   */
  getAdvertisingList(params: AdvertSearch): Promise<ListResponse<Advertising>> {
    return get('/api/v1/mjAdvertInfo/page', params)
  },

  /**
   * 创建广告
   */
  createAdvertising(data: Advertising): Promise<ApiResult<void>> {
    return post('/api/v1/mjAdvertInfo', data)
  },

  /**
   * 编辑广告
   */
  editAdvertising(data: Advertising): Promise<ApiResult<void>> {
    return put('/api/v1/mjAdvertInfo', data)
  },

  /**
   * 投放账号
   */
  setAdvertisingAccount(data: SetAdvertAccount): Promise<ApiResult<void>> {
    return post('/api/v1/mjAdvertInfo/setAccount', data)
  },

  /**
   * 删除广告
   */
  deleteAdvertising(id: number): Promise<ApiResult<void>> {
    return del(`/api/v1/mjAdvertInfo/{id}`)
  }
}
