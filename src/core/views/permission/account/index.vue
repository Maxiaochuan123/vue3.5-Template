<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NSwitch } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import DialogForm, { type FormType } from '@/core/form/DialogForm.vue'
import AccountForm from './components/AccountForm.vue'
import ResetPassword from './components/ResetPassword.vue'
import { enableDisableOptions } from '@/enum/options'
import { useAuthStore } from '@/core/stores/modules/auth'
import { userApi, type Account, type BaseUserSearch } from '@/core/api/modules/account'

const authStore = useAuthStore()

type TableDataRecord = Account

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseUserSearch>({
  key: null,
  status: null,
  roleId: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const dialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const formRef = ref<InstanceType<typeof AccountForm> | null>(null)
const formType = ref<FormType>('add')
const editData = ref<Partial<Account>>({})
const resetPasswordDialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const resetPasswordFormRef = ref<InstanceType<typeof ResetPassword> | null>(null)


// 搜索
const handleSearch = (values: BaseUserSearch) => {
  tableRef.value?.loadData(values)
}

// 刷新列表
const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 处理状态切换
const handleStatusChange = async (row: TableDataRecord, value: boolean) => {
  if (!row.id) return
  try {
    await userApi.updateStatus({ id: row.id, status: value ? 1 : 2 })
    refreshList()
  } catch (error) {
    // 状态切换失败，刷新列表恢复状态
    refreshList()
  }
}

// 表列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '用户名',
    key: 'userName',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '角色',
    key: 'role',
    width: 120,
    render: (row) => {
      const roleOption = authStore.auth.roleOptions.find(option => option.value === row.roleId)
      return roleOption?.label || '-'
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      return h(NSwitch, {
        value: row.status === 1,
        onUpdateValue: (value) => handleStatusChange(row, value),
      })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        permissionId: '7-1',
        actions: ['edit', 'view', 'delete'],
        deleteConfig: {
          content: '确定要删除该账号吗？删除后不可恢复！',
        },
        onAction: handleTableAction,
        customButtons: [
          {
            label: '重置密码',
            action: 'edit',
            type: 'warning',
            onClick: (row) => handleResetPassword(row)
          }
        ]
      })
    },
  },
]

// 处理表格操作
const handleTableAction = async (type: 'edit' | 'view' | 'delete', row: Record<string, any>) => {
  if (!row.id) return
  switch (type) {
    case 'edit':
    case 'view':
      handleUserForm(row, type)
      break
    case 'delete':
      try {
        await userApi.deleteUser(row.id)
        refreshList()
      } catch (error) {
        console.error('删除失败:', error)
      }
      break
  }
}

// 新增账号
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {}
  dialogRef.value?.open()
}

// 编辑处理
const handleUserForm = (row: Record<string, any>, type: 'edit' | 'view') => {
  formType.value = type
  editData.value = row
  dialogRef.value?.open()
}

// 重置密码
const handleResetPassword = (row: Record<string, any>) => {
  editData.value = row
  resetPasswordDialogRef.value?.open()
}

</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.key"
              placeholder="请输入用户名/昵称/邮箱"
              clearable
            />
          </NFormItem>

          <NFormItem label="状态">
            <NSelect
              v-model:value="searchForm.status"
              :options="enableDisableOptions"
              placeholder="请选择状态"
              clearable
            />
          </NFormItem>

          <NFormItem label="角色">
            <NSelect
              v-model:value="searchForm.roleId"
              :options="authStore.auth.roleOptions"
              placeholder="请选择角色"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <TableToolbarActions 
        :permission-id="'7-1'"
        :on-add="handleAdd"
      />
    </template>

    <!-- 表格区域 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="userApi.getUserList" />
    </template>

    <!-- 新增/编辑用户 -->
    <DialogForm
      ref="dialogRef"
      :width="500"
      :form-ref="formRef"
      :formType="formType"
      :add-api="userApi.createUser"
      :edit-api="userApi.updateUser"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <AccountForm ref="formRef" />
    </DialogForm>

    <!-- 重置密码 -->
    <DialogForm 
      ref="resetPasswordDialogRef" 
      :width="440" 
      title="重置密码"
      :form-ref="resetPasswordFormRef"
      :add-api="userApi.updatePassword"
    >
      <ResetPassword ref="resetPasswordFormRef" :id="editData.id ?? 0" />
    </DialogForm>
  </TablePageLayout>
</template> 