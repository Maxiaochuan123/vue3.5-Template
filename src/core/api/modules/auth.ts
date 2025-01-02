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

export interface RegisterParams {
  userName: string
  gender: string | null
  companyName: string
  mobile: string
  code: string
}

export const authApi = {
  /**
   * 用户登录
   */
  login(data: LoginParams): Promise<ApiResult<string>> {
    return post('/common/v1/admin/login', data)
  },

  /**
   * 获取权限菜单列表
   */
  getPermissions(): Promise<ApiResult<string>> {
    return get('/api/v1/mjUser/menuTree')
  },

  /**
   * 获取验证码
   */
  getVerificationCode(data: { phone: string, type: string }): Promise<ApiResult<string>> {
    return post('/common/v1/admin/getSmsCode', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },

  /**
   * 注册
   */
  register(data: RegisterParams): Promise<ApiResult<string>> {
    return post('/common/v1/admin/register', data)
  }
}
