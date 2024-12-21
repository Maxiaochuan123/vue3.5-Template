const permissionMenus = [
  {
    id: '1',
    sort: 1,
    name: '首页',
    permissions: []
  },
  {
    id: '2',
    sort: 2,
    name: '账户权益',
    permissions: []
  },
  {
    id: '3',
    sort: 3,
    name: '广告管理',
    permissions: ['add', 'edit', 'delete', 'view']
  },
  {
    id: '4',
    sort: 4,
    name: '财务管理',
    children: [
      {
        id: '4-1',
        sort: 4,
        name: '票据管理',
        permissions: ['add', 'edit', 'delete', 'view']
      }
    ]
  },
  {
    id: '5',
    sort: 5,
    name: '权限管理',
    children: [
      {
        id: '5-1',
        sort: 1,
        name: '账号管理',
        permissions: ['add', 'edit', 'delete', 'view']
      },
      {
        id: '5-2',
        sort: 2,
        name: '角色管理',
        permissions: []
      },
      {
        id: '5-3',
        sort: 3,
        name: '系统日志',
        permissions: []
      }
    ]
  }
]

export default permissionMenus 