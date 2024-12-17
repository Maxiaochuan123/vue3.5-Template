// 添加类型提取工具
export type ExtractOptionsValue<T extends { value: any }[]> = T[number]['value']

// 广告类型选项
export const advertisementTypeOptions = [
  { label: 'CPM: 展示广告', value: 'CPM' },
  { label: 'CPC: 可点击广告', value: 'CPC' },
  { label: 'CPA: 可下载广告', value: 'CPA' },
]
// 导出广告类型
export type AdvertisementType = ExtractOptionsValue<typeof advertisementTypeOptions>

// 状态选项
export const statusOptions = [
  { label: '审核通过', value: 'passed' },
  { label: '审核中', value: 'pending' },
  { label: '审核失败', value: 'failed' },
]
