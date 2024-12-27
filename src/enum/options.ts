/**
 * utils
 */
// 添加类型提取工具
export type ExtractOptionsValue<T extends { value: any }[]> = T[number]['value']

// 添加选项类型定义
export type Option = {
  label: string
  value: any
}

// 添加值映射方法
export function getOptionLabel(options: Option[], value: any): string {
  return options.find(option => option.value === value)?.label || ''
}

/**
 * 枚举
 */
// 广告类型选项
export const advertisingTypeOptions = [
  { label: 'CPM: 展示广告', value: 'CPM' },
  { label: 'CPC: 可点击广告', value: 'CPC' },
  { label: 'CPA: 可下载广告', value: 'CPA' },
]
// 导出广告类型
export type AdvertisingType = ExtractOptionsValue<typeof advertisingTypeOptions>

// 状态选项
export const defaultStatusOptions = [
  { label: '通过', value: 1 },
  { label: '不通过', value: 2 },
]

export const statusOptions = (labels = { pass: '通过', reject: '不通过' }) => [
  { label: labels.pass, value: 1 },
  { label: labels.reject, value: 2 },
]
// 导出状态类型
export type StatusType = ExtractOptionsValue<typeof defaultStatusOptions>

// 审核状态选项
export const auditStatusOptions = [
  { label: '待审核', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核失败', value: 2 },
]
// 导出状态类型
export type AuditStatusType = ExtractOptionsValue<typeof auditStatusOptions>
