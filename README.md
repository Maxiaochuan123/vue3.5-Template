# vue3-5-template

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Permission Management System

### Overview
The project implements a comprehensive RBAC (Role-Based Access Control) permission management system with the following features:
- Menu-level permissions
- Button-level permissions
- Dynamic permission rendering
- Permission directive control

### Core Components

#### 1. Permission Data Structure
```typescript
interface RolePermission {
  id: string          // Permission ID
  key: string         // Route name
  name: string        // Display name
  isChecked: boolean  // Selected status
  permissions: string[] // Function permissions list
  children?: RolePermission[] // Sub-menus
}
```

#### 2. Permission Sources
- Automatically generated from route configuration
- Page permissions defined via `meta.permissions`
- Two types of permissions:
  - Basic permissions (add, edit, delete, view, etc.)
  - Business permissions (module-specific operations)

#### 3. Button-Level Permission Control

##### Permission Directive (`btnPermission`)
```typescript
export const btnPermission: Directive = {
  mounted(el, binding) {
    const [permissionKey, action] = binding.value
    // Remove element if no permission
    if (!hasPermission(permissionKey, action)) {
      el.parentNode?.removeChild(el)
    }
  }
}
```

##### Permission Render Hook (`usePermissionRender`)
```typescript
const withPermission = (
  component: Component,
  props: Record<string, any>, 
  permissionId: string,
  action: string
) => {
  return withDirectives(h(component, props), [
    [btnPermission, [permissionId, action]]
  ])
}
```

### Features

1. **Permission Management**
   - Role-based permission assignment
   - Tree-structured permission configuration
   - Batch permission operations
   - Real-time permission preview

2. **Permission Control**
   - Route-level access control
   - Component-level permission rendering
   - Button-level permission control
   - Dynamic permission updates

3. **Performance Optimization**
   - Debounced permission validation
   - Computed property optimization
   - Selective node updates
   - DOM-level permission control

### Usage Examples

1. **Status Switch Permission**
```typescript
withPermission(NSwitch, {
  value: row.status === 1,
  onUpdateValue: handleStatusChange
}, 'permission-id', 'status')
```

2. **Action Buttons Permission**
```typescript
<TableActions
  :permission-id="permission-id"
  :actions="['edit', 'view', 'delete']"
/>
```

3. **Toolbar Permission**
```typescript
<TableToolbarActions
  :actions="['add']"
  :permission-id="permission-id"
/>
```

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
