export interface AppConfig {
  /**
   * 是否开启权限路由模式
   * @description true: 开启权限路由模式 false: 关闭权限路由模式
   * @default true
   */
  enablePermissionMode: boolean;
}

const appConfig: AppConfig = {
  enablePermissionMode: true
}

export default appConfig; 