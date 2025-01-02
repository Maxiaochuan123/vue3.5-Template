<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NButton, type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm, { type FormType } from '@/core/form/DrawerForm.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions, { type RowActionType } from '@/core/table/table-actions/index.vue'
import { advertisingTypeOptions, auditStatusOptions, getOptionLabel } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import AdvertisingForm from './components/AdvertisingForm.vue'
import { advertisingApi, type BaseAdvertSearch, type Advertising, type AdvertisingFormState } from '@/api/modules/advertising'
import { useMessage } from 'naive-ui'
import DialogForm from '@/core/form/DialogForm.vue'
import SetAdvertAccountForm from './components/SetAdvertAccountForm.vue'

const message = useMessage()

type TableDataRecord = Advertising

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseAdvertSearch>({
  key: null,
  dateRange: null,
  status: null,
  type: null,
})

// 搜索参数转换
const transformSearchParams = (params: any) => {
  console.log('transformSearchParams:', params)
  const { dateRange, ...rest } = params;
  return {
    ...rest,
    startDate: dateRange?.[0] ? new Date(dateRange[0]).toISOString().split('T')[0] : null,
    endDate: dateRange?.[1] ? new Date(dateRange[1]).toISOString().split('T')[0] : null
  }
}

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const formRef = ref<InstanceType<typeof AdvertisingForm> | null>(null)
const formType = ref<FormType>('add')
const editData = ref<Partial<Advertising>>({})
const setAdvertAccountDialogRef = ref<InstanceType<typeof DialogForm> | null>(null)
const setAdvertAccountFormRef = ref<InstanceType<typeof SetAdvertAccountForm> | null>(null)
        
// 搜索
const handleSearch = (values: BaseAdvertSearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '广告信息',
    key: 'descs',
    width: 400,
    render: renderAdvertisingInfo,
  },
  {
    title: '广告类型',
    key: 'type',
    render: (row) => {
      return getOptionLabel(advertisingTypeOptions, row.type)
    },
  },
  {
    title: '创建人',
    key: 'username',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    render: (row) => {
      return getOptionLabel(auditStatusOptions, row.status)
    },
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
        permissionId: 'advertising',
        actions: ['edit', 'view', 'delete'],
        deleteConfig: {
          content: '确定要删除该广告吗？删除后不可恢复！',
        },
        onAction: handleTableAction
      })
    },
  },
]

// 处理表格操作
const handleTableAction = async (type: RowActionType, row: TableDataRecord) => {
  if (!row.id) return
  switch (type) {
    case 'edit':
    case 'view':
    handleAdvertisingForm(row)
      break
    case 'delete':
      try {
        await advertisingApi.deleteAdvertising(row.id)
        refreshList()
      } catch (error) {
        console.error('删除失败:', error)
        message.error(`删除失败: ${error}`)
      }
      break
  }
}

// 打开抽屉
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {}
  drawerRef.value?.open()
}

const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 编辑处理
const handleAdvertisingForm = (row: TableDataRecord) => {
  formType.value = 'edit'
  editData.value = row
  drawerRef.value?.open()
}

const handleSetAdvertAccount = () => {
  console.log('投放账号')
  setAdvertAccountDialogRef.value?.open()
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch" :transform-params="transformSearchParams">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.key"
              placeholder="请输入标题关键词"
              clearable
            />
          </NFormItem>

          <NFormItem label="创建时间" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="广告类型" data-width="sm">
            <NSelect
              v-model:value="searchForm.type"
              :options="advertisingTypeOptions"
              placeholder="请选择广告类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="searchForm.status"
              :options="auditStatusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <TableToolbarActions
        permission-id="advertising"
        :actions="['add']"
        :custom-buttons="[
          {
            label: '设置投放账号',
            action: 'setAdvertisingAccount',
            type: 'primary',
            onClick: handleSetAdvertAccount
          }
        ]"
      />
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="advertisingApi.getAdvertisingList" />
    </template>

    <!-- 新增/编辑广告 -->
    <DrawerForm
      ref="drawerRef"
      :form-ref="formRef"
      :formType="formType"
      :add-api="advertisingApi.createAdvertising"
      :edit-api="advertisingApi.editAdvertising"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <AdvertisingForm ref="formRef" />
    </DrawerForm>

    <!-- 设置投放账号 -->
    <DialogForm 
      ref="setAdvertAccountDialogRef" 
      :width="440" 
      title="设置投放账号"
      :form-ref="setAdvertAccountFormRef"
      :add-api="advertisingApi.setAdvertisingAccount"
    >
      <SetAdvertAccountForm ref="setAdvertAccountFormRef" />
    </DialogForm>
  </TablePageLayout>
</template>
