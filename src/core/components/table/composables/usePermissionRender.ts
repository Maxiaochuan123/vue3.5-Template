import { h, withDirectives, resolveDirective, type Component } from 'vue'

/**
 * 权限渲染钩子函数
 * @returns {Object} 包含withPermission方法的对象
 */
export function usePermissionRender() {
  /**
   * 为组件添加权限控制指令
   * @param component 需要添加权限控制的组件
   * @param props 组件的props属性
   * @param permissionId 权限ID
   * @param action 操作类型
   * @returns 添加权限指令后的VNode,如果没有权限指令则返回null
   */
  const withPermission = (
    component: Component,
    props: Record<string, any>, 
    permissionId: string,
    action: string
  ) => {
    // 获取权限按钮指令
    const btnPermission = resolveDirective('btnPermission')
    // 如果存在权限指令,则添加权限控制,否则返回null
    return btnPermission ? withDirectives(h(component, props), [
      [btnPermission, [permissionId, action]]
    ]) : null
  }

  return {
    withPermission
  }
}