import { request } from '../server'

interface LoginParams {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  // 根据实际返回数据结构添加其他字段
}

export const authApi = {
  login(data: LoginParams) {
    return request.post<LoginResponse>('/common/v1/admin/login', data)
  },
}

export default authApi
