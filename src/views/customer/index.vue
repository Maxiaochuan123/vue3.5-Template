<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm, { type FormType } from '@/core/form/DrawerForm.vue'
import TableActions, { type RowActionType } from '@/core/table/table-actions/index.vue'
import { genderOptions, getOptionLabel, auditStatusOptions } from '@/enum/options'
import { customerApi, type BaseCustomerSearch, type Customer, type CustomerDetail } from '@/api/modules/customer'
import SaveCustomerForm from './components/SaveCustomerForm.vue'
import AddContractForm from './components/AddContractForm.vue'
import UpdatePassword from './components/UpdatePassword.vue'
import AuditForm from './components/AuditForm.vue'
import DialogForm from '@/core/form/DialogForm.vue'

type TableDataRecord = Customer

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseCustomerSearch>({
  key: null,
  dateRange: null,
  mobile: null,
  status: null
})

// 搜索参数转换
const transformSearchParams = (params: any) => {
  console.log('transformSearchParams:', params)
  const { dateRange, ...rest } = params;
  return {
    ...rest,
    startTime: dateRange?.[0] ? new Date(dateRange[0]).toISOString().split('T')[0] : null,
    endTime: dateRange?.[1] ? new Date(dateRange[1]).toISOString().split('T')[0] : null
  }
}

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const saveDrawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const saveCustomerFormRef = ref<InstanceType<typeof SaveCustomerForm> | null>(null)
const addDrawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const addContractFormRef = ref<InstanceType<typeof AddContractForm> | null>(null)
const updatePasswordDialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const updatePasswordFormRef = ref<InstanceType<typeof UpdatePassword> | null>(null)
const editData = ref<TableDataRecord>()
const auditDialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const auditFormRef = ref<InstanceType<typeof AuditForm> | null>(null)

// 搜索
const handleSearch = (values: BaseCustomerSearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '用户ID',
    key: 'id',
  },
  {
    title: '联系人',
    key: 'userName',
  },
  {
    title: '性别',
    key: 'gender',
    render: (row) => {
      return getOptionLabel(genderOptions, row.gender)
    }
  },
  {
    title: '手机号',
    key: 'mobile',
  },
  {
    title: '归属地',
    key: 'address',
  },
  {
    title: '状态',
    key: 'status',
    render: (row) => {
      return getOptionLabel(auditStatusOptions, row.status)
    },
  },
  {
    title: '申请注册时间',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    titleAlign: 'center',
    render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        permissionId: 'customer',
        actions: (row.status === 1 || row.status === 2) ? ['detail'] : [],
        onAction: handleTableAction,
        // 添加自定义按钮
        customButtons: [
          ...(row.status === 0 ? [{
            label: '审核',
            action: 'audit',
            type: 'info' as const,
            onClick: (row: TableDataRecord) => handleAudit(row)
          }] : []),
          ...(row.status === 1 ? [{
            label: '修改密码',
            action: 'updatePassword',
            type: 'info' as const,
            onClick: (row: TableDataRecord) => handleUpdatePassword(row)
          }] : []),
          ...((row.status === 1 || row.status === 2) ? [{
            label: '添加合同',
            type: 'warning' as const,
            action: 'addContract',
            onClick: (row: TableDataRecord) => handleAddContract(row)
          }] : [])
        ],
      })
    },
  },
]

// 处理表格操作
const handleTableAction = async (type: RowActionType, row: TableDataRecord) => {
  if (!row.id) return
  switch (type) {
    case 'detail':
      handleDetail(row)
      break
  }
}

// 审核
const handleAudit = (row: TableDataRecord) => {
  editData.value = row
  auditDialogRef.value?.open()
}

// 修改密码
const handleUpdatePassword = (row: TableDataRecord) => {
  editData.value = row
  updatePasswordDialogRef.value?.open()
}

// 添加合同
const handleAddContract = (row: TableDataRecord) => {
  const { type, ...otherRow } = row
  editData.value = {
    ...otherRow
  }
  addDrawerRef.value?.open()
}

// 处理详情按钮点击
const handleDetail = async (row: Customer) => {
  try {
    const { code, data } = await customerApi.getCustomerDetail(row.id as number)
    if (code === 200) {
      editData.value = data
      saveDrawerRef.value?.open()
    }
  } catch (error) {
    console.error('获取客户详情失败:', error)
  }
}

const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :transform-params="transformSearchParams" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="联系人关键词" data-width="md">
            <NInput
              v-model:value="searchForm.key"
              placeholder="请输入联系人关键词"
              clearable
            />
          </NFormItem>

          <NFormItem label="手机号" data-width="md">
            <NInput
              v-model:value="searchForm.mobile"
              placeholder="请输入手机号"
              clearable
            />
          </NFormItem>

          <NFormItem label="状态" data-width="md">
            <NSelect
              v-model:value="searchForm.status"
              :options="auditStatusOptions"
            />
          </NFormItem>

          <NFormItem label="注册日期范围" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="customerApi.getCustomerList" />
    </template>

    <!-- 保存实名信息 -->
    <DrawerForm
      ref="saveDrawerRef"
      :form-ref="saveCustomerFormRef"
      form-type="edit"
      edit-title="详情"
      submit-text="保存"
      :edit-api="customerApi.saveCustomer"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <SaveCustomerForm ref="saveCustomerFormRef" />
    </DrawerForm>

    <!-- 添加合同 -->
    <DrawerForm
      ref="addDrawerRef"
      :form-ref="addContractFormRef"
      form-type="edit"
      edit-title="添加合同"
      :edit-api="customerApi.createContract"
      :refresh-list="refreshList"
      :extra-fields="['id', 'status']"
      :edit-data="editData"
    >
      <AddContractForm ref="addContractFormRef" />
    </DrawerForm>

    <!-- 修改密码 -->
    <DialogForm 
      ref="updatePasswordDialogRef" 
      :width="440" 
      title="修改密码"
      :form-ref="updatePasswordFormRef"
      :add-api="customerApi.updatePassword"
      :refresh-list="refreshList"
    >
      <UpdatePassword ref="updatePasswordFormRef" :rowData="editData" />
    </DialogForm>

    <!-- 审核 -->
    <DialogForm 
      ref="auditDialogRef" 
      :width="440" 
      title="审核"
      :form-ref="auditFormRef"
      :add-api="customerApi.audit"
      :refresh-list="refreshList"
    >
      <AuditForm ref="auditFormRef" :rowData="editData" />
    </DialogForm>

  </TablePageLayout>
</template>
