import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from '@/utils/message'
import { useAuthStore } from '@/stores/modules/auth'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
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
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 这里可以根据实际接口返回格式修改
    if (res.code === 200) {
      return res
    } else {
      message.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error) => {
    message.error(error.message || 'Request Error')
    return Promise.reject(error)
  },
)

export interface ApiResult<T> {
  code: number
  msg: string
  data: T
}

/** 请求封装 */
export async function get<T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  const response = await service.get<ApiResult<T>>(url, { ...config, params })
  return response
}

export async function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  const response = await service.post<ApiResult<T>>(url, data, config)
  return response
}

export async function put<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  const response = await service.put<ApiResult<T>>(url, data, config)
  return response
}

export async function del<T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  const response = await service.delete<ApiResult<T>>(url, { ...config, params })
  return response
}

export default service
