import { post } from '@/api/server'

interface LoginParams {
  userName: string
  password: string
}

interface LoginResponse {
  code: number
  data: string // token字符串
  msg: string
}

export const authApi = {
  login(data: LoginParams) {
    return post<LoginResponse>('/common/v1/admin/login', data)
  },
}
