import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from '@/utils/message'
import { useAuthStore } from '@/core/stores/modules/auth'
import router from '@/router/instance'

export interface ApiResult<T = any> {
  code: number
  msg: string
  data: T
}

// 创建通用的 axios 实例工厂函数
export function createAxiosInstance(baseURL: string): AxiosInstance {
  const service: AxiosInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      if (authStore.token) {
        config.headers['Authorization'] = `${authStore.token}`
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

  return service
}

// 创建默认的 axios 实例
const service = createAxiosInstance(import.meta.env.VITE_BASE_URL)

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

export async function del<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return service.delete(url, { ...config, params })
}

export default service
