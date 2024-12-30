import { post, get } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { AuditStatusType, GenderType } from '@/enum/options'

export interface Customer {
  id?: number
  userName: string | null
  gender: GenderType | null
  mobile: string | null
  address: string | null
  status: AuditStatusType | null
  createTime: string | null
}

export interface CustomerDetail {
  address: string | null
  allRecharge: string | null
  auditContent: string | null
  auditTime: string | null
  auditUser: string | null
  companyName: string | null
  createTime: string | null
  enterpriseImg: string | null
  gender: GenderType | null
  gift: string | null
  identityImgList: string[] | null
  mobile: string | null
  nickname: string | null
  principal: string | null
  realName: string | null
  rechargeGift: string | null
  rechargePrincipal: string | null
  status: number | null
  userName: string | null
}

export interface CustomerSaveForm {
  id?: number
  companyName: string
  enterpriseImg: string
  identityImgList: string[]
  realName: string
}

export interface CreatedContract {
  id: number | null
  contractPrice: number | null
  contractUrl: string[] | null
  figtAmount: number | null
  name: string | null
  pricePrincipal: string | null
  principal: number | null
  status: AuditStatusType | null
  type: string | null
}

export interface BaseCustomerSearch {
  key?: string | null
  dateRange?: [number, number] | null
  mobile?: string | null
  status?: AuditStatusType | null
}

export interface CustomerSearch extends ListRequest, BaseCustomerSearch {}

export interface RegionResponse {
  records: Customer[]
  total: number
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
  createContract(data: CreatedContract): Promise<ApiResult<void>> {
    return post('/api/v1/mjCustomer/contract', data)
  },
}