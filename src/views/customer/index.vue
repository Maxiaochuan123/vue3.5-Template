<script setup lang="ts">
import { h, ref, reactive, provide } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm, { type FormType } from '@/core/form/DrawerForm.vue'
import TableActions, { type RowActionType } from '@/core/table/table-actions/index.vue'
import { genderOptions, getOptionLabel, auditStatusOptions } from '@/enum/options'
import { customerApi, type BaseCustomerSearch, type Customer, type CustomerDetail } from '@/api/modules/customer'
import SaveCustomerForm from './components/SaveCustomerForm.vue'

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
const detailDrawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const saveCustomerFormRef = ref<InstanceType<typeof SaveCustomerForm> | null>(null)
const formType = ref<FormType>('add')
const editData = ref<TableDataRecord>()

// 客户详情数据
const customerDetail = ref<CustomerDetail | null>(null)

// 提供给子组件的数据
provide('customerDetail', customerDetail)

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
        permissionId: '5',
        currentPermission: 'customer',
        actions: ['detail'],
        onAction: handleTableAction,
        // 添加自定义按钮
        customButtons: [
          {
            label: '审核',
            action: 'audit',
            onClick: (row) => handleAudit(row)
          },
          {
            label: '修改密码',
            action: 'updatePassword',
            onClick: (row) => handleUpdatePassword(row)
          },
          {
            label: '添加投放合同',
            type: 'warning',
            action: 'addContract',
            onClick: (row) => handleAddContract(row)
          }
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
  console.log('handleAudit:', row)
}

// 修改密码
const handleUpdatePassword = (row: TableDataRecord) => {
  console.log('handleUpdatePassword:', row)
}

// 添加投放合同
const handleAddContract = (row: TableDataRecord) => {
  console.log('handleAddContract:', row)
}

// 处理详情按钮点击
const handleDetail = async (row: Customer) => {
  try {
    const { code, data } = await customerApi.getCustomerDetail(row.id)
    if (code === 200) {
      formType.value = 'edit'
      customerDetail.value = data
      editData.value = data
      detailDrawerRef.value?.open()
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
      ref="detailDrawerRef"
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

  </TablePageLayout>
</template>
