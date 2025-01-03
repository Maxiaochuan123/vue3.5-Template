import { h, withDirectives, resolveDirective, type Component } from 'vue'

export function usePermissionRender() {
  const withPermission = (
    component: Component,
    props: Record<string, any>,
    permissionId: string,
    action: string
  ) => {
    const btnPermission = resolveDirective('btnPermission')
    return btnPermission ? withDirectives(h(component, props), [
      [btnPermission, [permissionId, action]]
    ]) : null
  }

  return {
    withPermission
  }
} 