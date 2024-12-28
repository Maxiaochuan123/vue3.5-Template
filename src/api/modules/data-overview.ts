import { get } from '@/api/server'
import type { ApiResult } from '@/api/types'

export interface AdvertiserData {
  num: number,
  passNum: number,
  waitNum: number,
}

export interface AdData {
  num: number,
  cpmNum: number,
  cpcNum: number,
  cpaNum: number,
  showNum: number,
  clickNum: number,
  downloadNum: number,
}

export interface RechargeData {
  num: number,
  amout: number,
  principal: number,
  rechangeNum: number,
}

export interface ConsumeData {
  consumNum: number,
  surplusNum: number,
  principalAmout: number,
  amout: number,
  surplusAmout: number,
  surplusPrincipalAmout: number,
}

export const dataOverviewApi = {
  /**
   * 获取广告主注册数据
   */
  getAdvertiserRegisterData(): Promise<ApiResult<AdvertiserData>> {
    return get('/api/v1/dataInfo/rigster')
  },

  /**
   * 获取广告投放数据
   */
  getAdData(): Promise<ApiResult<AdData>> {
    return get('/api/v1/dataInfo/place')
  },

  /**
   * 获取消耗数据
   */
  getConsumeData(): Promise<ApiResult<ConsumeData>> {
    return get('/api/v1/dataInfo/consume')
  },

  /**
   * 获取充值数据
   */
  getRechargeData(): Promise<ApiResult<RechargeData>> {
    return get('/api/v1/dataInfo/rechange')
  }
}
