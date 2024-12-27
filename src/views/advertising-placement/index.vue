<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NButton, type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm from '@/core/form/DrawerForm.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import { advertisingTypeOptions, auditStatusOptions, getOptionLabel } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import AdvertisingForm, { type FormState } from './components/AdvertisingForm.vue'
import { advertApi, type BaseAdvertSearch, type Advertising } from '@/api/modules/advertising'
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

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const formRef = ref<InstanceType<typeof AdvertisingForm> | null>(null)
const formType = ref<'add' | 'edit' | 'view'>('add')
const editData = ref<Partial<FormState>>({})
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
    key: 'desc',
    width: 400,
    render: renderAdvertisingInfo,
  },
  {
    title: '广告类型',
    key: 'type',
    width: 150,
    render: (row) => {
      return getOptionLabel(advertisingTypeOptions, row.type)
    },
  },
  {
    title: '创建人',
    key: 'username',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 150,
    render: (row) => {
      return getOptionLabel(auditStatusOptions, row.status)
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        permissionId: '3',
        actions: row.status === 1 ? ['edit', 'view'] : ['edit', 'view', 'delete'],
        deleteConfig: {
          content: '确定要删除该广告吗？删除后不可恢复！',
        },
        onAction: handleTableAction
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
    handleAdvertisingForm(row, type)
      break
    case 'delete':
      try {
        await advertApi.deleteAdvertising(row.id)
        refreshList()
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
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
const handleAdvertisingForm = (row: Record<string, any>, type: 'edit' | 'view') => {
  // const formattedData = {
  //   ...row,
  //   content: Array.isArray(row.content) ? row.content : [],
  //   icon: Array.isArray(row.icon) ? row.icon : []
  // }
  
  formType.value = type
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
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.keyword"
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
      <TableToolbarActions :on-add="handleAdd" permission-id="3">
        <template #default>
          <NButton type="primary" @click="handleSetAdvertAccount"> 设置投放账号 </NButton>
        </template>
      </TableToolbarActions>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="advertApi.getAdvertisingList" />
    </template>

    <!-- 新增/编辑广告 -->
    <DrawerForm
      ref="drawerRef"
      :form-ref="formRef"
      :formType="formType"
      :add-api="advertApi.createAdvertising"
      :edit-api="advertApi.editAdvertising"
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
      :add-api="advertApi.setAdvertisingAccount"
    >
      <SetAdvertAccountForm ref="setAdvertAccountFormRef" />
    </DialogForm>
  </TablePageLayout>
</template>
