import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from '@/utils/message'
import { useAuthStore } from '@/core/stores/modules/auth'
import router from '@/router'

export interface ApiResult<T = any> {
  code: number
  msg: string
  data: T
}

// 创建 axios 实例
const dataService: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ADVERTISING_PLACEMENT_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
dataService.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.auth.token) {
      config.headers['Authorization'] = `${authStore.auth.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
dataService.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 这里可以根据实际接口返回格式修改
    if (res.code === 200) {
      return res
    } else if (res.code === 700) {
      // token 无效，清除用户信息并跳转到登录页
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
      return Promise.reject(new Error(res.msg || 'Token Invalid'))
    } else {
      message.error(res.msg || 'Error')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  (error) => {
    message.error(error.message || 'Request Error')
    return Promise.reject(error)
  },
)

/** 请求封装 */
export async function dataGet<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return dataService.get(url, { ...config, params })
}

export default dataService
