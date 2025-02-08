<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import { advertiserManagementApi, type BaseAdvertiserManagementSearch, type AdvertiserManagement } from '@/api/modules/advertiserManagement'
import DialogForm from '@/core/form/DialogForm.vue'
import ClearBalanceForm from './components/ClearBalanceForm.vue'


type TableDataRecord = AdvertiserManagement

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseAdvertiserManagementSearch>({
  key: null,
  mobile: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const clearBalanceDialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const clearBalanceFormRef = ref<InstanceType<typeof ClearBalanceForm> | null>(null)
const rowData = ref<TableDataRecord | null>(null)
        
// 搜索
const handleSearch = (values: BaseAdvertiserManagementSearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '用户ID',
    key: 'id',
  },
  {
    title: '真实姓名',
    key: 'realName'
  },
  {
    title: '手机号',
    key: 'mobile',
    width: 120,
  },
  {
    title: '累计充值',
    key: 'totalRecharge'
  },
  {
    title: '总余额',
    key: 'totalAmount'
  },
  {
    title: '本金余额',
    key: 'principalAmount'
  },
  {
    title: '赠送余额',
    key: 'giftAmount'
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
        permissionId: 'advertiser-management',
        customButtons: [
          {
            label: '清空余额',
            action: 'clearBalance',
            type: 'info' as const,
            onClick: (row: TableDataRecord) => handleClearBalance(row)
          }
        ]
      })
    },
  },
]

// 清空余额
const handleClearBalance = (row: TableDataRecord) => {
  rowData.value = row
  clearBalanceDialogRef.value?.open()
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
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
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
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="advertiserManagementApi.getAdvertiserManagementList" />
    </template>

    <!-- 清空余额 -->
    <DialogForm 
      ref="clearBalanceDialogRef" 
      :width="440" 
      title="清空余额"
      submit-text="清空余额"
      confirm-message="该账户所有本金及赠送金额会清零！"
      :form-ref="clearBalanceFormRef"
      :add-api="advertiserManagementApi.clearBalance"
      :on-success="refreshList"
    >
      <ClearBalanceForm ref="clearBalanceFormRef" :row-data="rowData!" />
    </DialogForm>
  </TablePageLayout>
</template>
