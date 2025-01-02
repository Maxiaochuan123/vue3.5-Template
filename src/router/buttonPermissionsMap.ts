// 权限操作按钮映射 - 广告
export const permissionAdvertMap = {
    setAdvertisingAccount: '投放账号',
    advertisingPlacement: '投放广告',
    followUpInvestment: '追投',
    placementData: '投放数据',
  }
  
  // 权限操作按钮映射 - 客户
  export const permissionCustomerMap = {
    audit: '审核',
    updatePassword: '修改密码',
    addContract: '添加合同',
  }
  
  // 充值申请
  export const permissionRechargeApplyMap = {
    recharge: '充值',
  }
  
  // 广告主管理
  export const advertiserManagementMap = {
    clearBalance: '清空余额',
  }
  
  // 业务权限操作按钮映射
  export const businessButtonPermissionsMap = {
    ...permissionAdvertMap,
    ...permissionCustomerMap,
    ...permissionRechargeApplyMap,
    ...advertiserManagementMap,
  } 