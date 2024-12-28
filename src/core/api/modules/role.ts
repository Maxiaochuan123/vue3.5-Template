import { post, get, put, del } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { EnableDisableType } from '@/enum/options'


// 角色权限菜单类型
export interface RolePermission {
  id: string
  name: string
  isChecked: boolean
  permissions: string[]
  children?: RolePermission[]
}

// 角色信息类型
export interface Role {
  id: string
  name: string
  username: string
  status: EnableDisableType
  createTime: string
  menuTree: RolePermission[]
}

export interface BaseRoleSearch {
  name?: null
}

// 角色列表查询参数
export interface RoleListQuery extends ListRequest, BaseRoleSearch {}

// 角色更改状态
export interface RoleStatus {
  id: string
  status: EnableDisableType
}


// 创建/编辑角色参数
export interface RoleForm {
  id?: string
  name: string
  menuTree: RolePermission[]
}

// 角色下拉列表
export interface RoleOptions {
  label: string
  value: number
}

export const roleApi = {
  /**
   * 获取角色列表
   */
    getRoleList(params: RoleListQuery): Promise<ListResponse<Role>> {
    return get('/api/v1/mjrole', params)
  },

  /**
   * 创建角色
   */
    createRole(data: RoleForm): Promise<ApiResult<void>> {
    return post('/api/v1/mjrole', data)
  },

  /**
   * 角色下拉列表
   */
    getRoleOptions(): Promise<ApiResult<RoleOptions[]>> {
    return get('/api/v1/mjrole/roleList')
  },

  /**
   * 更新角色
   */
    updateRole(data: RoleForm): Promise<ApiResult<void>> {
    return put('/api/v1/mjrole', data)
  },

  /**
   * 检查角色名称是否重复
   */
    checkRoleNameRepeat(name: string): Promise<ApiResult<void>> {
    return post('/api/v1/mjrole/checkRepeat', { name })
  },

  /**
   * 修改角色状态
   */
    updateRoleStatus(data: RoleStatus): Promise<ApiResult<void>> {
    return put(`/api/v1/mjrole/status`, data)
  },

  /**
   * 删除角色
   */
  deleteRole(id: string): Promise<ApiResult<void>> {
    return del(`/api/v1/mjrole/${id}`)
  }
} 