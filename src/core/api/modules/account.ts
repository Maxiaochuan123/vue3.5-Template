import { post, get, put, del } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'

export interface Account {
  id?: number
  nickname: string
  userName: string
  password?: string
  mobile: string
  roleId: number | null
}

export interface BaseUserSearch {
  key?: string | null
  status?: number | null
  roleId?: number | null
}

export interface UserSearch extends ListRequest, BaseUserSearch {}

export const userApi = {
  /**
   * 获取用户列表
   */
  getUserList(params: UserSearch): Promise<ListResponse<Account>> {
    return get('/api/v1/mjUser/page', params)
  },

  /**
   * 创建用户
   */
  createUser(data: Account): Promise<ApiResult<void>> {
    return post('/api/v1/mjUser/insert', data)
  },

  /**
   * 更新用户
   */
  updateUser(data: Account): Promise<ApiResult<void>> {
    return put('/api/v1/mjUser', data)
  },

  /**
   * 修改密码
   */
  updatePassword(data: { id: number; password: string }): Promise<ApiResult<void>> {
    return put('/api/v1/mjUser/password', data)
  },

  /**
   * 修改状态
   */
  updateStatus(data: { id: number; status: number }): Promise<ApiResult<void>> {
    return put('/api/v1/mjUser/status', data)
  },

  /**
   * 删除用户
   */
  deleteUser(id: number): Promise<ApiResult<void>> {
    return del(`/api/v1/mjUser/${id}`)
  }
}
