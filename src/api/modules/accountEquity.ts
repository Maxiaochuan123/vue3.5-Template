import { get } from '@/api/server'
import type { ListRequest, ListResponse } from '@/api/types'
import type { ChangeType, ChangeStatusType } from '@/enum/options'


export interface AccountEquity {
  type: ChangeType
  status: ChangeStatusType
  principalAmount: string
  giftAmount: string
  username: string
  time: string
}

export interface BaseAccountEquitySearch {
  key?: string | null
  dateRange?: [] | null
  status?: ChangeStatusType | null
  type?: ChangeType | null
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
