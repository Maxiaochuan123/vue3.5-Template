import { businessButtonPermissionsMap } from '@/router/buttonPermissionsMap'

// 权限操作按钮映射 - 基础
const basicButtonPermissionMap = {
  add: '新增',
  edit: '编辑',
  delete: '删除',
  view: '查看',
  detail: '详情',
  status: '状态',
  export: '导出'
}

// 权限操作按钮映射
export const buttonPermissionMap = {
  ...basicButtonPermissionMap,
  ...businessButtonPermissionsMap,
}