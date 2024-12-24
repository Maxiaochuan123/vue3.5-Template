import { post, get, put, patch } from '@/api/server'
import type { ApiResult, ListRequest, ListResponse } from '@/api/types'
import type { StatusType } from '@/enum/options'


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
  username: string // 创建人
  status: StatusType // 1启用 2禁用
  createTime: string
  menuTree: RolePermission[]
}

// 角色列表查询参数
export interface RoleQuery extends ListRequest {
  name?: string
}


// 创建/编辑角色参数
export interface RoleForm {
  id?: string
  name: string
  menuTree: RolePermission[]
}

export const roleApi = {
  /**
   * 获取角色列表
   */
  async getRoleList(params: RoleQuery): Promise<ListResponse<Role>> {
    const response = await get<{ records: Role[]; total: number }>('/api/v1/mjrole', params)
    return response as ListResponse<Role>
  },

  /**
   * 创建角色
   */
  async createRole(data: RoleForm): Promise<ApiResult<void>> {
    return post('/api/v1/mjrole', data)
  },

  /**
   * 更新角色
   */
  async updateRole(data: RoleForm): Promise<ApiResult<void>> {
    return put('/api/v1/mjrole', data)
  },

  /**
   * 检查角色名称是否重复
   */
  async checkRoleNameRepeat(name: string): Promise<ApiResult<void>> {
    return post('/api/v1/mjrole/checkRepeat', { name })
  },

  /**
   * 修改角色状态
   */
  async updateRoleStatus(id: string, status: StatusType): Promise<ApiResult<void>> {
    return patch(`/api/v1/mjrole/${id}`, { status })
  }
} 