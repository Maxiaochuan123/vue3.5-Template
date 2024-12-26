import { post, get } from '@/api/server'
import type { ApiResult } from '@/api/types'

export interface LoginParams {
  userName: string
  password: string
}

export interface Permission {
  id: string
  name: string
  isChecked: boolean
  permissions: string[]
  children: Permission[]
}

export const authApi = {
  /**
   * 用户登录
   */
  login(data: LoginParams): Promise<ApiResult<string>> {
    return post('/common/v1/admin/login', data)
  },

  /**
   * 获取权限列表
   */
  getPermissions(): Promise<ApiResult<Permission[]>> {
    return get('/common/v1/admin/permissions')
  }
}
