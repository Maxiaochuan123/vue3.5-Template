import { get, put } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { RechargeApplyStatusType, SubmitAuditStatusType } from '@/enum/options'

export interface RechargeApply {
  id: number
  createTime: string
  createUser: string
  figtAmount: string
  mobile: string
  principal: string
  realName: string
  status: RechargeApplyStatusType
  type?: string
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
  status: RechargeApplyStatusType
  type: string
}

export interface RechargeApplyAuditForm {
  id: number | null
  status: SubmitAuditStatusType
  auditContent: string
}

export interface BaseRechargeApplySearch {
  key?: string
  mobile?: string
  status?: RechargeApplyStatusType | null
}

export interface RechargeApplySearch extends ListRequest, BaseRechargeApplySearch {}

export const rechargeApplyApi = {
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
   * 充值申请
   */
  recharge(data: RechargeApplyAuditForm): Promise<ApiResult<void>> {
    return put('/api/v1/mjRecharge/status', data)
  }
}