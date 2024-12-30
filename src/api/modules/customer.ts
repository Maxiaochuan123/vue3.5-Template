import { post, get } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { AuditStatusType, GenderType } from '@/enum/options'

export interface Customer {
  id?: number
  userName: string
  gender: GenderType
  mobile: string
  address: string
  status: AuditStatusType
  createTime: string
  type?: string
}

export interface CustomerDetail {
  address: string
  allRecharge: string
  auditContent: string
  auditTime: string
  auditUser: string
  companyName: string
  createTime: string
  enterpriseImg: string
  gender: GenderType
  gift: string
  identityImgList: string[]
  mobile: string
  nickname: string
  principal: string
  realName: string
  rechargeGift: string
  rechargePrincipal: string
  status: AuditStatusType
  userName: string
}

export interface CustomerSaveForm {
  id?: number
  companyName: string
  enterpriseImg: string
  identityImgList: string[]
  realName: string
}

export interface AddContract {
  id: number | null
  contractUrl: string[]
  pricePrincipal: string
  contractPrice: string
  figtAmount: string
  principal: string
  type: string
}

export interface BaseCustomerSearch {
  key?: string
  dateRange?: [number, number] | null
  mobile?: string
  status?: AuditStatusType
}

export interface CustomerSearch extends ListRequest, BaseCustomerSearch {}

export interface RegionResponse {
  records: Customer[]
  total: number
}

export interface AuditForm {
  id: number
  status: AuditStatusType
  auditContent: string
}

export const customerApi = {
  /**
   * 获取客户列表
   */
  getCustomerList(params: CustomerSearch): Promise<ListResponse<Customer>> {
    return get('/api/v1/mjCustomer/page', params)
  },

  /**
   * 获取客户详情
   */
  getCustomerDetail(id: number): Promise<ApiResult<CustomerDetail>> {
    return get(`/api/v1/mjCustomer/${id}`)
  },

  /**
   * 保存实名信息
   */
  saveCustomer(data: CustomerSaveForm): Promise<ApiResult<void>> {
    return post('/api/v1/mjCustomer/realInfo', data)
  },

  /**
   * 添加合同
   */
  createContract(data: AddContract): Promise<ApiResult<void>> {
    return post('/api/v1/mjCustomer/contract', data)
  },

  /**
   * 修改密码
   */
  updatePassword(data: { id: number; password: string }): Promise<ApiResult<void>> {
    return post('/api/v1/mjCustomer/password', data)
  },

  /**
   * 审核
   */
  audit(data: AuditForm): Promise<ApiResult<void>> {
    return post('/api/v1/mjCustomer/audit', data)
  }
}