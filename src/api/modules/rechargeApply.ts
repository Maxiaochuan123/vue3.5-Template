import { get, put } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { AuditStatusType } from '@/enum/options'

export interface RechargeApply {
  id: number
  createTime: string
  createUser: string
  figtAmount: string
  mobile: string
  principal: string
  realName: string
  status: AuditStatusType
  type: string
}

export interface RechargeApplyDetail {
  id: number
  address: string
  auditContent: string
  auditTime: string
  auditUser: string
  companyName: string
  enterpriseImg: string
  identityImgList: string[]
  mobile: string
  realName: string
  rechargeGift: string
  rechargePrincipal: string
  status: AuditStatusType
}

export interface RechargeApplyAuditForm {
  id: number
  status: AuditStatusType
  content: string
}

export interface BaseRechargeApplySearch {
  key?: string
  mobile?: string
  status?: AuditStatusType
}

export interface RechargeApplySearch extends ListRequest, BaseRechargeApplySearch {}

export interface RegionResponse {
  records: RechargeApply[]
  total: number
}

export interface AuditForm {
  id: number
  status: AuditStatusType
  auditContent: string
}

export const customerApi = {
  /**
   * 获取充值管理列表
   */
  getRechargeApplyList(params: RechargeApplySearch): Promise<ListResponse<RechargeApply>> {
    return get('/api/v1/mjRecharge/page', params)
  },

  /**
   * 获取详情
   */
  getRechargeApplyDetail(id: number): Promise<ApiResult<RechargeApplyDetail>> {
    return get(`/api/v1/mjRecharge/${id}`)
  },

  /**
   * 审核
   */
  audit(data: AuditForm): Promise<ApiResult<void>> {
    return put('/api/v1/mjRecharge/status', data)
  }
}