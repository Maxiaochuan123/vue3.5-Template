import { get } from '@/api/server'
import type { ListRequest, ListResponse } from '@/api/types'
import type { ChangeStatusType, BalanceChangeTypeType } from '@/enum/options'


export interface BalanceChange {
  id: string
  customerId: string
  companyName: string
  giftAmount: string
  principalAmount: string
  time: string
  username: string
  realName: string
  type: BalanceChangeTypeType
  status: ChangeStatusType
}

export interface BaseBalanceChangeSearch {
  key?: string | null
  dateRange?: [] | null
  status?: BalanceChangeTypeType | null
  type?: ChangeStatusType | null
}

export interface BalanceChangeSearch extends ListRequest, BaseBalanceChangeSearch {}

export const balanceChangeApi = {
  /**
   * 获取余额变动列表
   */
  getBalanceChangeList(params: BalanceChangeSearch): Promise<ListResponse<BalanceChange>> {
    return get('/api/v1/account/balance', params)
  }
}
