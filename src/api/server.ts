import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from '@/utils/message'
import { useAuthStore } from '@/stores/modules/auth'

export interface ApiResult<T = any> {
  code: number
  msg: string
  data: T
}

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
export async function get<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return service.get(url, { ...config, params })
}

export async function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return service.post(url, data, config)
}

export async function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return service.put(url, data, config)
}

export async function patch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return service.patch(url, data, config)
}

export async function del<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return service.delete(url, { ...config, params })
}

export default service
