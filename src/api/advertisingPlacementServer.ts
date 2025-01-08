import type { AxiosRequestConfig } from 'axios'
import { createAxiosInstance } from './server'
import type { ApiResult } from './server'

// 创建广告投放服务的 axios 实例
const dataService = createAxiosInstance(import.meta.env.VITE_ADVERTISING_PLACEMENT_BASE_URL)

/** 请求封装 */
export async function dataGet<T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> {
  return dataService.get(url, { ...config, params })
}

export default dataService
