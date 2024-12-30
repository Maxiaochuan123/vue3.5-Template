import { get } from '@/api/server'
import type { ListRequest, ListResponse } from '@/api/types'
import type { ChangeTypeType, ChangeStatusType } from '@/enum/options'


export interface AccountEquity {
  type: ChangeTypeType
  status: ChangeStatusType
  principalAmount: string
  giftAmount: string
  username: string
  time: string
}

export interface BaseAccountEquitySearch {
  key?: string
  dateRange?: [number, number] | null
  status: ChangeStatusType
  type?: ChangeTypeType
}

export interface AccountEquitySearch extends ListRequest, BaseAccountEquitySearch {}

export const accountEquityApi = {
  /**
   * 获取账户权益变动列表
   */
  getAccountEquityList(params: AccountEquitySearch): Promise<ListResponse<AccountEquity>> {
    return get('/api/v1/account', params)
  }
}
