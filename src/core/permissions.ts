// 权限操作按钮映射 - 基础
const permissionBasicMap = {
  add: '新增',
  edit: '编辑',
  delete: '删除',
  view: '查看',
  detail: '详情',
  status: '状态',
  export: '导出'
}

// 权限操作按钮映射 - 广告
const permissionAdvertMap = {
  setAdvertisingAccount: '投放账号',
  advertisingPlacement: '投放广告',
  followUpInvestment: '追投',
  placementData: '投放数据',
}

// 权限操作按钮映射 - 客户
const permissionCustomerMap = {
  audit: '审核',
  updatePassword: '修改密码',
  addContract: '添加投放合同',
}

// 权限操作按钮映射
export const permissionMap = {
  ...permissionBasicMap,
  ...permissionAdvertMap,
  ...permissionCustomerMap
}

// 权限配置
export const permissionMenus = [
  {
    id: '1',
    name: '首页',
    isChecked: false,
    permissions: []
  },
  {
    id: '2',
    name: '账户权益',
    isChecked: false,
    permissions: []
  },
  {
    id: '3',
    name: '广告管理',
    isChecked: false,
    permissions: ['add', 'edit', 'delete', 'setAdvertisingAccount']
  },
  {
    id: '4',
    name: '广告投放',
    isChecked: false,
    permissions: ['advertisingPlacement', 'followUpInvestment', 'placementData']
  },
  {
    id: '5',
    name: '客户管理',
    isChecked: false,
    permissions: ['audit', 'detail', 'updatePassword', 'addContract']
  },
  // {
  //   id: '5',
  //   name: '权限管理',
  //   isChecked: false,
  //   permissions: [],
  //   children: [
  //     {
  //       id: '4-1',
  //       name: '账号管理',
  //       isChecked: false,
  //       permissions: ['add', 'edit', 'status', 'delete', 'view']
  //     },
  //     {
  //       id: '4-2',
  //       name: '角色管理',
  //       isChecked: false,
  //       permissions: ['add', 'edit', 'status', 'delete', 'view']
  //     },
  //     {
  //       id: '4-3',
  //       name: '系统日志',
  //       isChecked: false,
  //       permissions: []
  //     }
  //   ]
  // },
  // {
  //   id: '5',
  //   name: '机器人管理',
  //   isChecked: false,
  //   permissions: []
  // }
]