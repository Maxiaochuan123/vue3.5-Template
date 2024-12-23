// 权限操作按钮映射
export const permissionMap = {
  add: '新增',
  edit: '编辑',
  delete: '删除',
  view: '查看',
  export: '导出'
}

// 权限配置
export const permissionMenus = [
  {
    id: '1',
    name: '首页',
    permissions: []
  },
  {
    id: '2',
    name: '账户权益',
    permissions: []
  },
  {
    id: '3',
    name: '广告管理',
    permissions: ['add', 'edit', 'delete', 'view']
  },
  {
    id: '4',
    name: '财务管理',
    children: [
      {
        id: '4-1',
        name: '票据管理',
        permissions: [],
        children: [
          {
            id: '4-1-1',
            name: '发票',
            permissions: ['add', 'edit', 'delete', 'view']
          }
        ]
      }
    ]
  },
  {
    id: '5',
    name: '权限管理',
    children: [
      {
        id: '5-1',
        name: '账号管理',
        permissions: ['add', 'edit', 'delete', 'view']
      },
      {
        id: '5-2',
        name: '角色管理',
        permissions: ['add', 'edit', 'delete', 'view']
      },
      {
        id: '5-3',
        name: '系统日志',
        permissions: []
      }
    ]
  }
]