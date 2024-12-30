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
  { label: 'CPM: 展示广告', value: 1 },
  { label: 'CPC: 可点击广告', value: 2 },
  { label: 'CPA: 可下载广告', value: 3 },
]
// 导出广告类型
export type AdvertisingType = ExtractOptionsValue<typeof advertisingTypeOptions>

// 启用禁用状态选项
export const enableDisableOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 2 },
]
// 导出状态类型
export type EnableDisableType = ExtractOptionsValue<typeof enableDisableOptions>

// 广告投放状态选项
export const advertPlacementStatusOptions = [
  { label: '待投放', value: 0 },
  { label: '投放中', value: 1 },
  { label: '已结束', value: 2 },
]
// 导出状态类型
export type AdvertPlacementStatusType = ExtractOptionsValue<typeof advertPlacementStatusOptions>

// 审核状态选项
export const auditStatusOptions = [
  { label: '待审核', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核失败', value: 2 },
]
// 导出状态类型
export type AuditStatusType = ExtractOptionsValue<typeof auditStatusOptions>

// 变动类型选项
export const changeTypeOptions = [
  { label: '归零', value: 1 },
  { label: '广告投放', value: 2 },
  { label: '重置', value: 3 },
]
// 导出状态类型
export type ChangeTypeType = ExtractOptionsValue<typeof changeTypeOptions>

// 变动状态选项
export const changeStatusOptions = [
  { label: '减少', value: 1 },
  { label: '增加', value: 2 },
]
// 导出状态类型
export type ChangeStatusType = ExtractOptionsValue<typeof changeStatusOptions>

// 性别选项
export const genderOptions = [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
]
// 导出状态类型
export type GenderType = ExtractOptionsValue<typeof genderOptions>
