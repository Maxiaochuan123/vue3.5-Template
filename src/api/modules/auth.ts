import { post, get } from '@/api/server'
import type { ApiResult } from '@/api/types'

export interface LoginParams {
  userName: string
  password: string
}

export type LoginData = string

export interface Permission {
  id: string
  name: string
  isChecked: boolean
  permissions: string[]
  children: Permission[]
}

export type LoginResponse = ApiResult<LoginData>
export type PermissionResponse = ApiResult<Permission[]>

export const authApi = {
  async login(data: LoginParams): Promise<LoginResponse> {
    const response = await post<LoginData>('/common/v1/admin/login', data)
    return response as LoginResponse
  },
  async getPermissions(): Promise<PermissionResponse> {
    const response = await get<Permission[]>('/common/v1/admin/permissions')
    return response as PermissionResponse
  }
}
